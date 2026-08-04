import express from "express";

import { validate } from "../../middleware/validate.js";
import { loginController, logoutController, refreshController, registerController, registerEmpController } from "./auth.controller.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router = express.Router();

router.post('/login', validate({ body: loginSchema }), asyncHandler(loginController));
router.post(
    '/register',
    authenticate,
    authorize(['admin']),
    validate({ body: registerSchema }),
    asyncHandler(registerController)
);
router.post(
    '/register-employee',
    authenticate,
    authorize(['admin']),
    validate({ body: employeeRegisterSchema }),
    asyncHandler(registerEmpController)
);
router.post('/refresh', asyncHandler(refreshController));
router.post('/logout', asyncHandler(logoutController));


export default router;