import { col, fn, literal, Op, QueryTypes, where } from "sequelize";
import { sequelize } from "../../config/db.js";

import { Plantation, Donation, Team, Donor, WateringSchedule } from "../../models/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { RADIUS_ENTITIES } from "../../constants/common.js";

export const overallActivityReport = async ({ from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };
    // Total plantation, trees planted, guards installed
    const plantationStats = await Plantation.findAll({
        attributes: [
            [fn("COUNT", col("plantationId")), "totalPlantations"],
            [fn("SUM", col("treesPlanted")), "totalTreesPlanted"],
            [fn("SUM", col("treeGuards")), "totalGuardInstalled"],
        ],
        where: {
            plantationDate: dateRange,
        },
        raw: true,
    });

    // donations recieved, funds available.
    const donationStats = await Donation.findAll({
        attributes: [
            [fn("SUM", col("amount")), "donationsRecieved"],
            [fn("SUM", col("availableAmount")), "donationAvailable"],
        ],
        where: {
            donationDate: dateRange,
        },
        raw: true,
    });

    // pending watering schedules
    const pendingWatering = await WateringSchedule.count({
        where: {
            isCompleted: 0,
        },
    });

    // Team wise plantation
    // Treewise Service

    return { plantationStats, donationStats, pendingWatering };
}


export const teamActivityReport = async ({ teamId, from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };

    const teamPlantations = await Plantation.findAll({
        where: {
            teamId,
            plantationDate: dateRange
        }
    });

    const totalPlantations = teamPlantations.length;

    const totalTreesPlanted = teamPlantations.reduce(
        (total, plantation) => total + plantation.treesPlanted,
        0
    );

    return { plantations: teamPlantations, totalPlantations, totalTreesPlanted };
}

export const teamWisePlantation = async ({ from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };

    const teamWiseStats = await Team.findAll({
        attributes: [
            "teamId",
            "teamName",
            "isActive",
            [fn("COUNT", col("plantations.plantationId")), "totalPlantations",],
            [fn("COALESCE", fn("SUM", col("plantations.treesPlanted")), 0), "totalTreesPlanted",],
        ],
        include: [{
            model: Plantation,
            as: "plantations",
            attributes: [],
            where: {
                plantationDate: dateRange,
            },
            required: false,
        }],
        group: [
            "Team.teamId",
            "Team.teamName",
            "Team.isActive",
        ],
        raw: true,
    });

    return teamWiseStats;
}

export const donorWisePlantation = async ({ from, to }) => {
    // const dateRange = { [Op.gte]: from, [Op.lte]: to };
    // const donorFields = ["donorId", "fullName", "mobileNumber", "treeGuardsProvided", "saplingsProvided", "isActive"];

    return await sequelize.query(
        `SELECT
            d.*,
            ISNULL(p.totalPlantations, 0) AS totalPlantations,
            ISNULL(p.totalTreesPlanted, 0) AS totalTreesPlanted,
            ISNULL(dn.totalDonationAmount, 0) AS totalDonationAmount,
            ISNULL(dn.totalAvailableAmount, 0) AS totalAvailableAmount
        FROM DonorMaster d
        LEFT JOIN (
            SELECT donorId,
                COUNT(*) totalPlantations,
                SUM(treesPlanted) totalTreesPlanted
            FROM Plantation
            WHERE plantationDate BETWEEN :from AND :to
            GROUP BY donorId
        ) p ON p.donorId = d.donorId
        LEFT JOIN (
            SELECT donorId,
                SUM(amount) totalDonationAmount,
                SUM(availableAmount) totalAvailableAmount
            FROM Donations
            WHERE donationDate BETWEEN :from AND :to
            GROUP BY donorId
        ) dn ON dn.donorId = d.donorId`,
        {
            replacements: { from, to },
            type: QueryTypes.SELECT,
        }
    );
};

export const areaWisePlantation = async ({ area, from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };
    if (!area.trim()) throw ApiError.badRequest("Area is required for area wise report");

    const plantations = await Plantation.findAll({
        where: {
            locationName: { [Op.substring]: area },
            plantationDate: dateRange
        }
    });

    return plantations;
};

export const radiusReport = async ({ latitude, longitude, distance, entity, from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };

    const targetPoint = `geography::Point(${latitude}, ${longitude}, 4326)`;

    const report = {};

    // Plantation Query
    if (entity === RADIUS_ENTITIES.ALL || entity === RADIUS_ENTITIES.PLANTATION) {
        const plantations = await sequelize.query(
            `
            SELECT *
            FROM Plantation
            WHERE location.STDistance(
                geography::Point(:latitude, :longitude, 4326)
            ) <= :distance
            AND plantationDate BETWEEN :from AND :to
            `,
            {
                replacements: {
                    latitude,
                    longitude,
                    distance,
                    from,
                    to,
                },
                type: QueryTypes.SELECT,
            }
        );

        report.plantations = plantations;
    }
    
    // Watering Query
    if (entity === RADIUS_ENTITIES.ALL || entity === RADIUS_ENTITIES.WATERING) {
        const wateringLocs = await sequelize.query(
            `
            WITH LatestSchedules AS (
                SELECT
                    *,
                    ROW_NUMBER() OVER (
                        PARTITION BY wateringLocationId
                        ORDER BY scheduledDate DESC
                    ) AS rn
                FROM WateringSchedules
                WHERE location.STDistance(
                    geography::Point(:latitude, :longitude, 4326)
                ) <= :distance
                AND scheduledDate BETWEEN :from AND :to
            )
            SELECT *
            FROM LatestSchedules
            WHERE rn = 1;
            `,
            {
                replacements: {
                    latitude,
                    longitude,
                    distance,
                    from,
                    to,
                },
                type: QueryTypes.SELECT,
            }
        );

        report.wateringLocs = wateringLocs;
    }

    return report;
};
