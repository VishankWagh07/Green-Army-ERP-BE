import express from "express";
import asyncHandler from "../../middlewares/asyncHandler.js";
import { validate } from "../../middlewares/validate.js";
import { teamIdSchema, teamNameSchema } from "./team.schema.js";
import { authenticate, authorize } from "../../middlewares/auth.js";
import { createTeamController, deleteTeamController, getTeamMembersController, getTeamsController, updateTeamController } from "./team.controller.js";
import { USER_ROLES } from "../../constants/auth.js";

const router = express.Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]))

router.post("/", validate({ body: teamNameSchema }), asyncHandler(createTeamController));

router.get("/", asyncHandler(getTeamsController));

router.get("/:teamId/team-members", validate({ params: teamIdSchema }), asyncHandler(getTeamMembersController));

router.put("/:teamId", validate({ params: teamIdSchema, body: teamNameSchema }), asyncHandler(updateTeamController));

router.delete("/:teamId", validate({ params: teamIdSchema }), asyncHandler(deleteTeamController));

export default router;
