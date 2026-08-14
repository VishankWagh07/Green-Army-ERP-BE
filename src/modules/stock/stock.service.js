import { sequelize } from "../../config/db.js";
import { STOCK_TYPES } from "../../constants/common.js";
import { Donation, Donor } from "../../models/donor.model.js";
import { Stock, StockVariant } from "../../models/stock.model.js";
import { ApiError } from "../../utils/ApiError.js";

// STOCK_VARIANT

export const getStockVariants = async () => {
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

export const deleteStockVariant = async (variantId) => {
    const stockVariant = await StockVariant.findByPk(variantId);

    if (!stockVariant) throw ApiError.notFound('StockVariant Not Found');

    stockVariant.isActive = false;
    await stockVariant.save();

    return stockVariant;
}


// STOCK

export const getStock = async () => {
    const stocks = await Stock.findAll();
    return stocks;
}

export const addStock = async (payload) => {
    // donation avl amt, donor prvd upd, stk crt
    const donation = await Donation.findByPk(payload.donationId);
    if(!donation) throw ApiError.notFound("Donation Not found");

    const donor = await Donor.findByPk(donation.donorId);

    const stock =  await sequelize.transaction(async t => {
        // Create stock
        payload.quantityAvailable = payload.quantityBought;
        const stock = await Stock.create(payload, {transaction:t});

        const stockVariant = await StockVariant.findByPk(stock.variantId);

        // Update donation available amount
        if(donation.availableAmount < stock.amount) throw ApiError.badRequest("Insufficient Donation Funds");
        donation.availableAmount -= stock.amount;
        await donation.save({transaction:t});

        // Update Donor sappling & guards provided
        if(stockVariant.type === STOCK_TYPES.SAPLING) donor.saplingsProvided += stock.quantity;
        else if(stockVariant.type === STOCK_TYPES.GUARD) donor.treeGuardsProvided += stock.quantity;
        await donor.save({transaction:t});

        return stock;
    });

    return stock;
}

export const deductStockQty = async (stockId, qtyToDeduct, transaction) => {
    const stock = await Stock.findByPk(stockId);
    
    if(!stock) throw ApiError.notFound("Stock Not found");

    if(stock.quantityAvailable < qtyToDeduct) throw ApiError.badRequest("Insufficient quantity");
    stock.quantityAvailable -= qtyToDeduct;

    if(transaction) return await stock.save({transaction});
    await stock.save();
}

// export const updateStock = async (stockId, payload) => {
//     return await sequelize.transaction(async t => {
//         const stock = await Stock.findByPk(stockId);
//         if (!stock) throw ApiError.notFound('Stock Not Found');

//         const stockVariant = await StockVariant.findByPk(stock.variantId);
//         if (!stockVariant) throw ApiError.notFound('StockVariant Not Found');
        
//         const donation = await Donation.findByPk(stock.donationId);
//         if (!donation) throw ApiError.notFound('Donation Not Found');
    
//         if(payload.quantity != null){// qty -> donor qty upd 
//             const donor = await Donor.findByPk(donation.donorId);
//             if (!donor) throw ApiError.notFound("Donor Not Found");
//             const qtyToBeAdded = payload.quantity - stock.quantity;
            
//             if(stockVariant.type === STOCK_TYPES.SAPLING) donor.saplingsProvided += qtyToBeAdded;
//             else if(stockVariant.type === STOCK_TYPES.GUARD) donor.treeGuardsProvided += qtyToBeAdded;
//             await donor.save({transaction:t});
//         }
        
//         if(payload.amount != null){// amt -> donation avl amt
//             const amtToBeAdded = payload.amount - stock.amount;

//             donation.availableAmount += amtToBeAdded;
//             await donation.save({transaction:t});
//         }

//         await stock.update(payload,{transaction:t});

//         return stock;
//     })
// }

export const deleteStock = async (stockId) => {
    const stock = await Stock.findByPk(stockId);

    if (!stock) throw ApiError.notFound('Stock Not Found');

 /*
 !!! NEED TO UPDATE DONOR TREE & GUARD PROVIDED BASED ON THE DELETION !!!
 !!! NEED TO UPDATE DONATION AVL. AMOUNT BASED ON THE DELETION !!!
 */
    await stock.destroy();

    return stock;
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