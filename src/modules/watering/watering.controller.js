import { sendSuccess } from "../../utils/ApiResponse.js";
import { addWateringLocation, addWateringSchedule, deleteWateringLocation, getWateringLocations, getWateringSchedule, updateWateringLocation } from "./watering.service.js";

// Watering Location

export async function addWateringLocationController(req, res) {

  const wateringLocation = await addWateringLocation({...req.body});

  sendSuccess(res, { statusCode: 200, data: { wateringLocation } });
}

export async function getWateringLocationsController(req, res) {

  const wateringLocations = await getWateringLocations({...req.query});

  sendSuccess(res, { statusCode: 200, data: { wateringLocations } });
}

export async function updateWateringLocationController(req, res) {
  const { locationId } = req.params;

  const updateCount = await updateWateringLocation({locationId, ...req.body});

  sendSuccess(res, { statusCode: 200, data: { updateCount: updateCount[0] } });
}

export async function deleteWateringLocationController(req, res) {

  const deleteCount = await deleteWateringLocation({ ...req.params });

  sendSuccess(res, { statusCode: 200, data: { deleteCount: deleteCount[0] } });
}

// Watering schedule

export async function addWateringScheduleController(req, res) {

  const schedule = await addWateringSchedule({...req.body});

  sendSuccess(res, { statusCode: 200, data: { schedule } });
}

export async function getWateringScheduleController(req, res) {

  const schedules = await getWateringSchedule({...req.query});

  sendSuccess(res, { statusCode: 200, data: { schedules } });
}