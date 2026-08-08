import express from "express";

import { validate } from "../../middlewares/validate.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { USER_ROLES } from "../../constants/auth.js";
import { idParamSchema, userUpdateSchema } from "./user.schema.js";
import { deleteUserController, getUserByIdController, getUsersController, updateUserController } from "./user.controller.js";

const router = express.Router();

router.get(
    '/',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    asyncHandler(getUsersController)
);
router.get(
    '/:userId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema }),
    asyncHandler(getUserByIdController)
);

router.patch(
    '/:userId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema, body: userUpdateSchema }),
    asyncHandler(updateUserController)
);
router.delete(
    '/:userId',
    authenticate,
    authorize([USER_ROLES.ADMIN]),
    validate({ params: idParamSchema }),
    asyncHandler(deleteUserController)
);

export default router;