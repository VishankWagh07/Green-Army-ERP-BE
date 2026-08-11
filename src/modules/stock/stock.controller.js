import { sendSuccess } from "../../utils/ApiResponse.js";
import { addStockVariant, deleteStockVariant, getStockVariant, updateStockVariant } from "./stock.service.js";

// STOCK_VARIANT

// get stock controller
export const getStockVariantController = async (req, res) => {
    const stockVariants = await getStockVariant();
    sendSuccess(res, { data: stockVariants });
}

// add stock controller
export const addStockVariantController = async (req, res) => {
    const stockVariant = await addStockVariant(req.body);
    sendSuccess(res, { data: stockVariant });
}

// update stock controller
export const updateStockVariantController = async (req, res) => {
    const stockVariant = await updateStockVariant(req.params.variantId, req.body);
    sendSuccess(res, { data: stockVariant });
}

// delete stock controller
export const deleteStockVariantController = async (req, res) => {
    const stockVariant = await deleteStockVariant(req.params.variantId);
    sendSuccess(res, { data: stockVariant });
}
