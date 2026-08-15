import { col, fn, literal, Op, where } from "sequelize";
import { sequelize } from "../../config/db.js";

import { Plantation, Donation, Team, Donor, WateringSchedule } from "../../models/index.js";
import { ApiError } from "../../utils/ApiError.js";
import { RADIUS_ENTITIES } from "../../constants/common.js";

export const overallActivityReport = async ({ from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };
    // Total plantation, trees planted, guards installed
    const plantationStats = await Plantation.findOne({
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
    const donationStats = await Donation.findOne({
        attributes: [
            [fn("SUM", col("amount")), "donationsRecieved"],
            [fn("SUM", col("availableAmount")), "donationAvailable"],
        ],
        where: {
            plantationDate: dateRange,
        },
        raw: true,
    });

    // Team wise plantation
    // Treewise Service

    return { plantationStats, donationStats };
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
        attributes: ["teamId", "teamName", "isActive"],
        include: [{
            model: Plantation,
            attributes: [
                [fn("COUNT", col("plantations.plantationId")), "totalPlantations"],
                [
                    fn("COALESCE", fn("SUM", col("plantations.treesPlanted")), 0),
                    "totalTreesPlanted",
                ],
            ],
            where: {
                plantationDate: dateRange,
            },
            required: false
        }],
        group: [
            "Team.teamId",
            "Team.teamName",
            "Team.isActive",
        ],
    });

    return teamWiseStats;
}

export const donorWisePlantation = async ({ from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };
    const donorFields = ["donorId", "fullName", "mobileNumber", "treeGuardsProvided", "saplingsProvided", "isActive"];

    return await Donor.findAll({
        attributes: donorFields,
        include: [
            {
                model: Plantation,
                as: "plantations",
                attributes: [
                    [fn("COUNT", col("plantations.plantationId")), "totalPlantations"],
                    [fn("COALESCE", fn("SUM", col("treesPlanted")), 0), "totalTreesPlanted"],
                    [fn("COALESCE", fn("SUM", col("treeGuards")), 0), "totalTreeGuards"],
                ],
                where: { plantationDate: dateRange },
                required: false,
            },
            {
                model: Donation,
                as: "donations",
                attributes: [
                    [fn("COALESCE", fn("SUM", col("amount")), 0), "totalDonationAmount"],
                    [fn("COALESCE", fn("SUM", col("availableAmount")), 0), "totalAvailableAmount"],
                ],
                where: { donationDate: dateRange },
                required: false,
            },
        ],
        // Maps the attributes array dynamically so you don't type them twice
        group: donorFields.map(field => `Donor.${field}`),
    });
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

export const radiusReport = async ({ latitude, longitude, distance, entities, from, to }) => {
    const dateRange = { [Op.gte]: from, [Op.lte]: to };

    const targetPoint = `geography::Point(${latitude}, ${longitude}, 4326)`;

    const report = {};

    if (entities.includes(RADIUS_ENTITIES.PLANTATION)) {
        const plantations = await Plantation.findAll({
            where: {
                [Op.and]: [
                    where(
                        // Call the MSSQL STDistance method on your location column
                        fn(
                            "STDistance", col("location"), literal(targetPoint)
                        ),
                        {
                            // SQL Server calculates distance in meters (5000 meters = 5 Km)
                            [Op.lte]: Number(distance),
                        }
                    ),
                    {
                        scheduledDate: dateRange
                    }
                ]
            }
        });

        report.plantations = plantations;
    }
    if (entities.includes(RADIUS_ENTITIES.WATERING)) {
        const wateringLocs = await WateringSchedule.findAll({
            where: {
                [Op.and]: [
                    where(
                        // Call the MSSQL STDistance method on your location column
                        fn(
                            "STDistance", col("location"), literal(targetPoint)
                        ),
                        {
                            // SQL Server calculates distance in meters (5000 meters = 5 Km)
                            [Op.lte]: Number(distance),
                        }
                    ),
                    {
                        scheduledDate: dateRange
                    }
                ]
            }
        });

        report.wateringLocs = wateringLocs;
    }

    return report;
};
