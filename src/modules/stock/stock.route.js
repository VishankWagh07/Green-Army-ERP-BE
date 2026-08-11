import express from "express";
import { USER_ROLES } from "../../constants/auth";
import { authenticate, authorize } from "../../middlewares/auth";
import asyncHandler from "../../middlewares/asyncHandler";
import { validate } from "../../middlewares/validate";
import { idParamSchema, stockLogSchema, stockLogsQuerySchema, stockSchema, stockUpdateSchema, stockVariantSchema, stockVariantUpdateSchema } from "./stock.schema";
import { addStockVariantController, deleteStockVariantController, getStockVariantController, updateStockVariantController } from "./stock.controller";

const router = express.Router();

// STOCK_VARIANT

router.get(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    asyncHandler(getStockVariantController)
);

router.post(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ body: stockVariantSchema }),
    asyncHandler(addStockVariantController)
);

router.patch(
    '/:variantId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema, body: stockVariantUpdateSchema }),
    asyncHandler(updateStockVariantController)
);

router.delete(
    '/:variantId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema }),
    asyncHandler(deleteStockVariantController)
);

export default router;
