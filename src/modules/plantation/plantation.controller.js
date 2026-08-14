import { sendSuccess } from "../../utils/ApiResponse.js";
import { addPlantation, deletePlantation, getPlantations, updatePlantation } from "./plantation.service.js";

// get Plantations controller
export const getPlantationsController = async (req, res) => {
    const plantations = await getPlantations();
    sendSuccess(res, { data: plantations });
}

// add Plantation controller
export const addPlantationController = async (req, res) => {
    const plantation = await addPlantation(req.body);
    sendSuccess(res, { data: plantation });
}

// update plantation controller
export const updatePlantationController = async (req, res) => {
    const plantation = await updatePlantation(req.params.plantationId, req.body);
    sendSuccess(res, { data: plantation });
}

// delete Plantation controller
export const deletePlantationController = async (req, res) => {
    const plantation = await deletePlantation(req.params.plantationId);
    sendSuccess(res, { data: plantation });
}