import { sequelize } from "../../config/db.js";
import { STOCK_TYPES } from "../../constants/common.js";
import { Plantation } from "../../models/plantation.model.js";
import { PlantationStockUsage } from "../../models/stock.model.js";

import { ApiError } from "../../utils/ApiError.js";
import { deductStockQty } from "../stock/stock.service.js";

export const getPlantations = async () => {
    const plantations = await Plantation.findAll();

    return plantations;
}

export const addPlantation = async (payload) => {
    const { plantation, stockUsed } = payload;

    const newPlantation = await sequelize.transaction(async t => {
        // TreesPlanted & TreeGuards
        let treesPlanted = 0;
        let treeGuards = 0;
        for (stock of stockUsed) {
            if (stock.variantType === STOCK_TYPES.SAPLING) treesPlanted += stock.quantityUsed;
            if (stock.variantType === STOCK_TYPES.GUARD) treeGuards += stock.quantityUsed;
        }

        // create Plantation event
        const { latitude, longitude, ...remPlantation } = plantation;
        const newPlantation = await Plantation.create({
            ...remPlantation,
            treesPlanted,
            treeGuards,
            location: sequelize.literal(
                `geography::Point(${latitude}, ${longitude}, 4326)`
            ),
        }, { transaction: t });

        for (stock of stockUsed) {
            // deduct used stock quantity
            await deductStockQty(stock.stockId, stock.quantityUsed, t);

            // log in PlantationStockUsage: amt qty
            await PlantationStockUsage.create({
                plantationId: newPlantation.plantationId,
                stockId: stock.stockId,
                quantity: stock.quantityUsed,
            }, { transaction: t });
        }

        return newPlantation;
    });

    return newPlantation;
}

export const updatePlantation = async (variantId, payload) => {
    const plantation = await Plantation.findByPk(variantId);

    if (!plantation) throw ApiError.notFound('Plantation Not Found');

    const { latitude, longitude, ...remPayload } = payload;

    await plantation.update({
        ...remPayload,
        location: sequelize.literal(
            `geography::Point(${latitude}, ${longitude}, 4326)`
        ),
    });

    return plantation;
}

export const deletePlantation = async (variantId) => {
    const plantation = await Plantation.findByPk(variantId);

    if (!plantation) throw ApiError.notFound('Plantation Not Found');

    // plantation.isActive = false;
    await plantation.destroy();

    return plantation;
}