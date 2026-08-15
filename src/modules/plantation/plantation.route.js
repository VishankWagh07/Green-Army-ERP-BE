import express from "express";

import { authenticate, authorize } from "../../middlewares/auth.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { addPlantationController, deletePlantationController, getPlantationsController, updatePlantationController } from "./plantation.controller.js";
import { idParamSchema, plantationSchema, plantationUpdateSchema } from "./plantation.schema.js";
import { USER_ROLES } from "../../constants/auth.js";

const router = express.Router();

router.get(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    asyncHandler(getPlantationsController)
);

router.post(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ body: plantationSchema }),
    asyncHandler(addPlantationController)
);

router.patch(
    '/:plantationId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema, body: plantationUpdateSchema }),
    asyncHandler(updatePlantationController)
);

// router.delete(
//     '/:plantationId',
//     authenticate,
//     authorize([USER_ROLES.ADMIN]),
//     validate({ params: idParamSchema }),
//     asyncHandler(deletePlantationController)
// );

export default router;
