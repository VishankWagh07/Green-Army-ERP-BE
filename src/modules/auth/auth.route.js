import express from "express";

import { loginController, logoutController, registerController } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = express.Router();

router.post('/login', validate({ body: loginSchema }), asyncHandler(loginController));
router.post(
    '/register',
    validate({ body: registerSchema }),
    asyncHandler(registerController)
);
router.post('/logout', asyncHandler(logoutController));
// router.post('/refresh', asyncHandler(refreshController));


export default router;