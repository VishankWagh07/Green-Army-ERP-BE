import express from "express";

import { loginController, logoutController, refreshController, registerController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = express.Router();

router.post('/login', validate({ body: loginSchema }), asyncHandler(loginController));
router.post(
    '/register',
    validate({ body: registerSchema }),
    asyncHandler(registerController)
);
router.post('/refresh', asyncHandler(refreshController));
router.post('/logout', asyncHandler(logoutController));


export default router;