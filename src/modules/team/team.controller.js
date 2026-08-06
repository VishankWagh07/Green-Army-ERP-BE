import { sendSuccess } from "../../utils/ApiResponse.js";
import {
  createTeam,
  deleteTeam,
  getTeams,
  updateTeam,
} from "./team.service.js";

export async function createTeamController(req, res) {
  const { teamName } = req.body;

  const team = await createTeam({ teamName });

  sendSuccess(res, { statusCode: 201, data: { team } });
}

export async function getTeamsController(req, res) {
  const { teamId, isActive } = req.query;

  const teams = await getTeams({ teamId, isActive });

  sendSuccess(res, { statusCode: 200, data: { teams } });
}

export async function updateTeamController(req, res) {
  const { teamId } = req.params;
  const { teamName } = req.body;

  const updateCount = await updateTeam({ teamId, teamName });

  sendSuccess(res, { statusCode: 200, data: { updateCount: updateCount[0] } });
}

export async function deleteTeamController(req, res) {
  const { teamId } = req.params;

  const deleteCount = await deleteTeam({ teamId });

  sendSuccess(res, { statusCode: 200, data: { deleteCount: deleteCount[0] } });
}
