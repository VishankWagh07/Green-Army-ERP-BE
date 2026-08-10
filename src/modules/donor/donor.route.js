import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { USER_ROLES } from "../../constants/auth.js";
import { donorDonationIdSchema, donorIdSchema, donationFilterSchema, postDonationSchema, postDonorSchema, putDonationSchema, putDonorSchema, donorFilterSchema } from "./donor.schema.js";
import { addDonationController, createDonorController, deleteDonationController, deleteDonorController, getDonationsController, getDonorsController, updateDonationController, updateDonorController } from "./donor.controller.js";

const router = express.Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]))

// DONOR CRUD
 
router.post("/", validate({ body: postDonorSchema }), asyncHandler(createDonorController));

// get one/many include donation amount, assets provided
router.get("/", validate({ query: donorFilterSchema }), asyncHandler(getDonorsController));

router.put("/:donorId", validate({ params: donorIdSchema, body: putDonorSchema }), asyncHandler(updateDonorController));

router.delete("/:donorId", validate({ params: donorIdSchema }), asyncHandler(deleteDonorController));

// DONATION 

router.post("/:donorId/donations", validate({ params: donorIdSchema, body: postDonationSchema }), asyncHandler(addDonationController));

router.get("/:donorId/donations", validate({ params: donorIdSchema, query: donationFilterSchema }), asyncHandler(getDonationsController));

router.patch("/:donorId/donations/:donationId", validate({ params: donorDonationIdSchema, body: putDonationSchema }), asyncHandler(updateDonationController));

router.delete("/:donorId/donations/:donationId", validate({ params: donorDonationIdSchema }), asyncHandler(deleteDonationController));

export default router;
