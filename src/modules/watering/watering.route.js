import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { USER_ROLES } from "../../constants/auth.js";
import { locationFilterSchema, locationIdSchema, postLocationSchema, postScheduleSchema, putLocationSchema, scheduleFilterSchema } from "./watering.schema.js";
import { addWateringLocationController, addWateringScheduleController, deleteWateringLocationController, getWateringLocationsController, getWateringScheduleController, updateWateringLocationController } from "./watering.controller.js";

const router = express.Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]))

// Watering Location

router.post("/locations", validate({ body: postLocationSchema }), asyncHandler(addWateringLocationController));

// get one/many include donation amount, assets provided
router.get("/locations", validate({ query: locationFilterSchema }), asyncHandler(getWateringLocationsController));

router.patch("/locations/:locationId", validate({ params: locationIdSchema, body: putLocationSchema }), asyncHandler(updateWateringLocationController));

router.delete("/locations/:locationId", validate({ params: locationIdSchema }), asyncHandler(deleteWateringLocationController));

// Watering Schedule
 
router.post("/schedule", validate({ body: postScheduleSchema }), asyncHandler(addWateringScheduleController));

router.get("/schedule", validate({ query: scheduleFilterSchema }), asyncHandler(getWateringScheduleController));

export default router;