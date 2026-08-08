import { sendSuccess } from "../../utils/ApiResponse.js";
import { addPhotos, deletePhotos, getPhotos } from "./photo.service.js";

export async function addPhotosController(req, res) {

    const {entityType, entityId} = req.params;

    const result = await addPhotos({entityType, entityId, files: req.files, uploadedBy: req.user?.userId || "9998B2CA-2C90-4812-B8F6-345A6CA58C0A"})

    sendSuccess(res, { statusCode: 201, data: result });
}

export async function getPhotosController(req, res) {

    const {entityType, entityId} = req.params;

    const photos = await getPhotos({entityType, entityId})

    sendSuccess(res, { statusCode: 200, data: photos });
}

export async function deletePhotosController(req, res) {

    const {entityType, entityId, photoId} = req.params;

    const deletedCount = await deletePhotos({entityType, entityId, photoId})

    sendSuccess(res, { statusCode: 204, data: {deletedCount} });
}
