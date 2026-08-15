import express from "express";

import { authenticate, authorize } from "../../middlewares/auth.js";

import { validate } from "../../middlewares/validate.js";
import { overallActivityQuerySchema, plantationQuerySchema, radiusReportQuerySchema, teamActivityQuerySchema } from "./report.schema.js";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { overallActivityController, plantationReportController, radiusReportController, teamActivityController } from "./report.controller.js";

const router = express.Router();

router.use(authenticate,authorize([USER_ROLES.ADMIN]));


// Overall Green army Activity report
router.get(
    '/overall-activity-report',
    validate({ query: overallActivityQuerySchema}),
    asyncHandler(overallActivityController)
);


// TEAM

// Monthly / yearly team activity report
router.get(
    '/team-activity-report',
    validate({ query: teamActivityQuerySchema}),
    asyncHandler(teamActivityController)
);


// PLANTATION

// Plantation wise report + Total number of trees planted, donations received, tree guards/cages and saplings
// Team wise Plt report
// Donor wize Plt report
// Location wise Plt report
router.get(
    '/plantation-report',
    validate({ query: plantationQuerySchema}),
    asyncHandler(plantationReportController)
);

// distance wise all reports 

// location, distance, entities

router.get(
    '/radius-report',
    validate({query: radiusReportQuerySchema}),
    asyncHandler(radiusReportController)
)

export default router;
