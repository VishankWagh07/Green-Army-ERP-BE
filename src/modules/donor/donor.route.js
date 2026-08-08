import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { USER_ROLES } from "../../constants/auth.js";
import { donorIdSchema, postDonorSchema, putDonorSchema } from "./donor.schema.js";
import { createDonorController, getDonorsController, updateDonorController } from "./donor.controller.js";

const router = express.Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]))

// DONOR CRUD
 
router.post("/", validate({ body: postDonorSchema }), asyncHandler(createDonorController));

// get one/many include donation amount, assets provided
router.get("/", asyncHandler(getDonorsController));

router.put("/:donorId", validate({ params: donorIdSchema, body: putDonorSchema }), asyncHandler(updateDonorController));

// router.delete("/:teamId", validate({ params: teamIdSchema }), asyncHandler(deleteTeamController));

// DONATION 

export default router;
