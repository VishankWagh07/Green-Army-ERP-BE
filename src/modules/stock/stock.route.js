import express from "express";
import { USER_ROLES } from "../../constants/auth.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { idParamSchema, stockSchema, stockVariantSchema, stockVariantUpdateSchema, variantIdParamSchema } from "./stock.schema.js";
import { addStockController, addStockVariantController, deleteStockVariantController, getStockController, getStockVariantsController, updateStockVariantController } from "./stock.controller.js";

const router = express.Router();

// STOCK_VARIANT

router.get(
    '/variants',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    asyncHandler(getStockVariantsController)
);

router.post(
    '/variants',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ body: stockVariantSchema }),
    asyncHandler(addStockVariantController)
);

router.patch(
    '/variants/:variantId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: variantIdParamSchema, body: stockVariantUpdateSchema }),
    asyncHandler(updateStockVariantController)
);

router.delete(
    '/variants/:variantId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: variantIdParamSchema }),
    asyncHandler(deleteStockVariantController)
);


// STOCK

// get stock available
router.get(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    asyncHandler(getStockController)
);

// add stock bought from donation 
router.post(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ body: stockSchema }),
    asyncHandler(addStockController)
);

// update stock
// router.patch(
//     '/:stockId',
//     authenticate,
//     authorize([USER_ROLES.ADMIN]),
//     validate({ params: idParamSchema, body: stockUpdateSchema }),
//     asyncHandler(updateStockController)
// );

export default router;
