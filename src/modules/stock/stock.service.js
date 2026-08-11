import { StockVariant } from "../../models/stock.model.js";
import { ApiError } from "../../utils/ApiError.js";

// STOCK_VARIANT

export const getStockVariant = async () => {
    const stockVariants = await StockVariant.findAll();
    return stockVariants;
}

export const addStockVariant = async (payload) => {
    const stockVariantExist = await StockVariant.findOne({ where: { variantName: payload.variantName } });

    if (stockVariantExist) throw ApiError.badRequest('StockVariant Already present');

    const stockVariant = StockVariant.create(payload);

    return stockVariant;
}

export const updateStockVariant = async (variantId, payload) => {
    const stockVariant = await StockVariant.findByPk(variantId);

    if (!stockVariant) throw ApiError.notFound('StockVariant Not Found');

    await stockVariant.update(payload);

    return stockVariant;
}

export const deleteStockVariant = async (stockVariantId) => {
    const stockVariant = await StockVariant.findByPk(stockVariantId);

    if (!stockVariant) throw ApiError.notFound('StockVariant Not Found');

    stockVariant.isActive = false;
    await stockVariant.save();

    return stockVariant;
}


// // STOCK LOGS

// export const getStockLogs = async ({ page, limit, stockType, from, to }) => {
//     const where = {};
//     if (stockType) where.stockType = stockType;
//     if (from || to) {
//         where.attendanceDate = {};
//         if (from) where.attendanceDate[Op.gte] = from;
//         if (to) where.attendanceDate[Op.lte] = to;
//     }

//     const { rows, count } = await StockLog.findAndCountAll({
//         where,
//         order: [['logDate', 'DESC']],
//         limit,
//         offset: (page - 1) * limit,
//     });

//     return { data: rows, total: count };
// }

// export const addStockLog = async (payload) => {
//     // stock qty update
//     // donation stock in -> donor stock++, donation avb amt
//     // add stock log 
    
//     // Stock log Transaction start
//     const result = await sequelize.transaction(async t => {

//         const stock = await Stock.findByPk(payload.stockId);

//         if (!stock) throw ApiError.notFound('Stock Not Found');

//         if (payload.referenceType === STOCK_LOG_REFS.DONATION) {
//             const donation = await Donation.findByPk(payload.referenceId);
//             if (!donation) throw ApiError.notFound('Donation Not Found');

//             if (payload.type === "IN") {
//                 if (donation.availableAmount < Number(payload.amountSpent))
//                     throw ApiError.badRequest('Amoutn spent more than available donation amount');
//                 donation.availableAmount -= Number(payload.amountSpent);
//             }
//             else throw ApiError.notFound('Ref_Donation must always add stock');

//             const donor = await Donor.findByPk(donation.donorId);

//             if (stock.stockType === STOCK_TYPES.GUARD) donor.treeGuardsProvided += payload.quantity;
//             else if (stock.stockType === STOCK_TYPES.SAPLING) donor.saplingsProvided += payload.quantity;

//             await donation.save({transaction:t});
//             await donor.save({transaction:t});
//         }
//         else if (payload.referenceType === STOCK_LOG_REFS.PLANTATION) {
//             const plantation = await Plantation.findByPk(payload.referenceId);
//             if (!plantation) throw ApiError.notFound('Plantation Not Found');
//         }
//     })
//     // Stock log Transaction end
// }