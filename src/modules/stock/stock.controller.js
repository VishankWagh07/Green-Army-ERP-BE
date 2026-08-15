import { sendSuccess } from "../../utils/ApiResponse.js";
import { addStock, addStockVariant, deleteStockVariant, getStock, getStockVariants, updateStockVariant } from "./stock.service.js";

// STOCK_VARIANT

// get stockVariant controller
export const getStockVariantsController = async (req, res) => {
    const stockVariants = await getStockVariants();
    sendSuccess(res, { data: stockVariants });
}

// add stockVariant controller
export const addStockVariantController = async (req, res) => {
    const stockVariant = await addStockVariant(req.body);
    sendSuccess(res, { data: stockVariant });
}

// update stockVariant controller
export const updateStockVariantController = async (req, res) => {
    const stockVariant = await updateStockVariant(req.params.variantId, req.body);
    sendSuccess(res, { data: stockVariant });
}

// delete stockVariant controller
export const deleteStockVariantController = async (req, res) => {
    const stockVariant = await deleteStockVariant(req.params.variantId);
    sendSuccess(res, { data: stockVariant });
}


// STOCK

// get stock controller
export const getStockController = async (req, res) => {
    const stocks = await getStock();
    sendSuccess(res, { data: stocks });
}

// add stock controller
export const addStockController = async (req, res) => {
    const stock = await addStock(req.body);
    sendSuccess(res, { data: stock });
}

// update stock controller
// export const updateStockController = async (req, res) => {
//     const stock = await updateStock(req.params.stockId, req.body);
//     sendSuccess(res, { data: stock });
// }