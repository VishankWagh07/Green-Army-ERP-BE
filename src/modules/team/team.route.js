import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { teamIdSchema, teamNameSchema } from "./team.schema.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { createTeamController, deleteTeamController, getTeamsController, updateTeamController } from "./team.controller.js";
import { USER_ROLES } from "../../constants/auth.js";

const router = express.Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]))

router.post("/", validate({ body: teamNameSchema }), asyncHandler(createTeamController));

router.get("/", asyncHandler(getTeamsController));

router.put("/:teamId", validate({ params: teamIdSchema, body: teamNameSchema }), asyncHandler(updateTeamController));

router.delete("/:teamId", validate({ params: teamIdSchema }), asyncHandler(deleteTeamController));

export default router;
