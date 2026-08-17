import { Op, Sequelize } from "sequelize";
import { ApiError } from "../../utils/ApiError.js";
import { models, sequelize } from "../../models/index.js";
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

const getPreviousWateringSchedule = async (wateringLocationId) => {
  const previousSchedule = await WateringSchedule.findOne({
    where: {
      wateringLocationId,
    },
    order: [["scheduledDate", "DESC"]],
    raw: true,
  });
  return previousSchedule;
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

export const getWateringLocations = async (payload) => {
  const { locationId, plantationId } = payload || {};

  let where = {};

  if (locationId) {
    where.locationId = locationId;
  }
  if (plantationId) {
    where.plantationId = plantationId;
  }

  const wateringLocations = await WateringLocation.findAll({
    where,
    attributes: {
      include: [
        // 1. Use .Long and .Lat for SQL Server SqlGeography types
        [Sequelize.literal("[plantation].location.Long"), "longitude"],
        [Sequelize.literal("[plantation].location.Lat"), "latitude"],
      ],
    },
    include: [
      {
        model: Plantation,
        as: "plantation",
        attributes: {
          include: [
            // 1. Use .Long and .Lat for SQL Server SqlGeography types
            [Sequelize.literal("location.Long"), "longitude"],
            [Sequelize.literal("location.Lat"), "latitude"],
          ],
          exclude: ["location"],
        },
      },
    ],
    raw: true,
    nest: true,
  });

  return wateringLocations;
};

/*
get all watering locations - populate plantation
loop and find previous watered schedule
    no previous > 
      check plantation date frequency days is today

    previous not complete > 
      check previous + frequency days is today
      but also send previous not complete

    previous complete
      check previous + frequency days is today

    for all > add in schedule

return locations with prev schedule
*/

export const getReminderWateringLocations = async () => {
  const allLocations = await getWateringLocations();

  let reminderLocations = [];

  const today = new Date();

  // allLocations.forEach(async (location) => {
  for (let idx = 0; idx < allLocations.length; idx++) {
    const location = allLocations[idx];
    
    const plantation = location.plantation;

    // get previous schedule
    const previousSchedule = await getPreviousWateringSchedule(
      location.wateringLocationId,
    );

    let previousDate;

    // if no schedule, previous date = plantation date
    if (!previousSchedule) {
      previousDate = new Date(plantation.plantationDate);
    } else {
      previousDate = new Date(previousSchedule.scheduledDate);
    }

    // find next date
    const frequencyDays = location.frequencyDays;

    const nextDate = new Date(previousDate);
    nextDate.setDate(nextDate.getDate() + frequencyDays);

    console.log(
      "nxt dt",
      previousDate,
      frequencyDays,
      nextDate.toISOString().split("T")[0],
      today.toISOString().split("T")[0],
      nextDate.toISOString().split("T")[0] <= today.toISOString().split("T")[0],
    );

    // today
    if (
      nextDate.toISOString().split("T")[0] <= today.toISOString().split("T")[0]
    ) {
      // add new schedule3
      await addWateringSchedule({
        wateringLocationId: location.wateringLocationId,
        scheduledDate: today,
        latitude: plantation.latitude,
        longitude: plantation.longitude,
        locationName: plantation.locationName,
        googleMapLink: plantation.googleMapLink,
        reminderTime: today.getTime(),
        notes: "Added from reminder",
      });

      let dueDays = Math.floor((today - previousDate) / (1000 * 60 * 60 * 24));

      // add for reminder
      reminderLocations.push({ ...location, previousSchedule, dueDays });
      console.log(plantation);
    }
  }
  // });

  console.log(reminderLocations);

  return reminderLocations;
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
    latitude,
    longitude,
    locationName,
    googleMapLink,
    assignedUserId = null,
    reminderTime,
    notes,
  } = payload;

  if (assignedUserId) await getUserById(assignedUserId);

  const wateringLocation =
    await checkWateringLocationExists(wateringLocationId);

  const previousSchedule =
    await getPreviousWateringSchedule(wateringLocationId);

  if (previousSchedule) {
    const prevScheduleDate = new Date(previousSchedule.scheduledDate);
    const newScheduleDate = new Date(scheduledDate);

    const frequencyDays = wateringLocation.frequencyDays;

    const minimumNextDate = new Date(prevScheduleDate);
    minimumNextDate.setDate(minimumNextDate.getDate() + frequencyDays);

    if (newScheduleDate < minimumNextDate) {
      throw ApiError.badRequest(
        `The next watering schedule must be at least ${frequencyDays} days after the previous schedule ${prevScheduleDate}.`,
      );
    }
  }

  const createData = {
    wateringLocationId,
    scheduledDate,
    location: sequelize.literal(
      `geography::Point(${latitude}, ${longitude}, 4326)`,
    ),
    locationName,
    googleMapLink,
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
