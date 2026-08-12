import { Op } from "sequelize";
import { ApiError } from "../../utils/ApiError.js";
import { models } from "../../models/index.js";
// import {
//   WateringLocation,
//   WateringSchedule,
// } from "../../models/watering.model.js";
import { Plantation } from "../../models/plantation.model.js";
import { getUserById } from "../user/user.service.js";

const { WateringLocation, WateringSchedule } = models;

const checkPlantationExists = async (plantationId) => {
  const plantationExists = await Plantation.findByPk(plantationId);
  if (!plantationExists) throw ApiError.notFound("Plantation not found");
};

const checkWateringLocationExists = async (wateringLocationId) => {
  const wateringLocation = await WateringLocation.findByPk(wateringLocationId);
  if (!wateringLocation) throw ApiError.notFound("Watering Location not found");
  return wateringLocation;
};

// Watering Location

export const addWateringLocation = async ({ plantationId, frequencyDays }) => {
  checkPlantationExists(plantationId);

  const wateringLocation = await WateringLocation.create({
    plantationId,
    frequencyDays,
  });

  return wateringLocation;
};

export const getWateringLocations = async ({ locationId, plantationId }) => {
  let where = {};

  if (locationId) {
    where.locationId = locationId;
  }
  if (plantationId) {
    where.plantationId = plantationId;
  }

  const wateringLocations = await WateringLocation.findAll({ where });

  return wateringLocations;
};

export const updateWateringLocation = async ({ locationId, frequencyDays }) => {
  let where = { wateringLocationId: locationId };

  return await WateringLocation.update({ frequencyDays }, { where });
};

export const deleteWateringLocation = async ({ locationId }) => {
  let where = { wateringLocationId: locationId };

  return await WateringLocation.update({ isActive: false }, { where });
};

// Watering schedule

export const addWateringSchedule = async (payload) => {
  const {
    wateringLocationId,
    scheduledDate,
    assignedUserId,
    reminderTime,
    notes,
  } = payload;

  if (assignedUserId) await getUserById(assignedUserId);

  const wateringLocation =
    await checkWateringLocationExists(wateringLocationId);

  const lastSchedule = await WateringSchedule.findOne({
    where: {
      wateringLocationId,
    },
    order: [["scheduledDate", "DESC"]],
  });

  if (lastSchedule) {
    const prevScheduleDate = new Date(lastSchedule.scheduledDate);
    const newScheduleDate = new Date(scheduledDate);

    const frequencyDays = wateringLocation.frequencyDays;

    const minimumNextDate = new Date(prevScheduleDate);
    minimumNextDate.setDate(
      minimumNextDate.getDate() + frequencyDays
    );

    if (newScheduleDate < minimumNextDate) {
      throw ApiError.badRequest(
        `The next watering schedule must be at least ${frequencyDays} days after the previous schedule ${prevScheduleDate}.`
      );
    }
  }

  const createData = {
    wateringLocationId,
    scheduledDate,
    assignedUserId,
    reminderTime,
    notes,
  };

  return await WateringSchedule.create(createData);
};

export const getWateringSchedule = async ({
  from,
  to = from,
  isCompleted = false,
}) => {
  console.log("wa sc", from, to, isCompleted);

  let where = {
    isCompleted,
  };

  if (isCompleted) {
    where.completedAt = {
      [Op.between]: [new Date(from), new Date(to)],
    };
  } else {
    where.scheduledDate = {
      [Op.between]: [new Date(from), new Date(to)],
    };
  }

  const schedules = await WateringSchedule.findAll({
    where,
    include: [
      {
        model: WateringLocation,
        as: "wateringLocation",
      },
    ],
  });

  return schedules;
};
