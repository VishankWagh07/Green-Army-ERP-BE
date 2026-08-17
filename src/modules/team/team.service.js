import { User } from "../../models/auth.model.js";
import { Team } from "../../models/team.model.js";
import { ApiError } from "../../utils/ApiError.js";
import z from "zod";

const checkTeamNameExists = async (teamName) => {
  const existingTeam = await Team.findOne({
    where: { teamName },
  });
  if (existingTeam)
    throw ApiError.conflict("Team with this team Name already exists");
};

export const createTeam = async (payload) => {
  const { teamName } = payload;

  await checkTeamNameExists(teamName);

  return await Team.create({ teamName });
};

export const getTeams = async (payload) => {
  const { teamId, isActive } = payload;

  const parsedIsActive = isActive === undefined ? true : isActive === "true";

  let where = { isActive: parsedIsActive };

  if (teamId?.trim()) {
    const trimmedTeamId = teamId.trim();
    const result = z.uuidv4().safeParse(trimmedTeamId);

    if (!result.success) {
      throw ApiError.badRequest(
        "Validation failed",
        result.error?.flatten()?.fieldErrors,
      );
    }
    where.teamId = trimmedTeamId;
  }

  return await Team.findAll({ where });
};

export const getTeamMembers = async (payload) => {
  const { teamId } = payload;

  let where = {
    isActive: true,
    teamId,
  };

  return await User.findAll({
    where,
    include: [
      {
        model: Team,
        as: "team",
      },
    ],
  });
};

export const updateTeam = async (payload) => {
  const { teamId, teamName } = payload;

  await checkTeamNameExists(teamName);

  let where = { teamId };

  return await Team.update({ teamName }, { where });
};

export const deleteTeam = async (payload) => {
  const { teamId } = payload;

  let where = { teamId };

  return await Team.update({ isActive: false }, { where });
};
