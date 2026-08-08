import Photo from "../../models/photo.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const addPhotos = async (payload) => {
  const { entityType, entityId, files, uploadedBy } = payload;

  if (!files || files.length == 0) throw ApiError.badRequest("No files uploaded.");

  const photosList = files.map((file) => ({
    entityType,
    entityId,
    photoUrl: `/uploads/${entityType}/${entityId}/${file.filename}`,
    uploadedBy,
  }));

  const photos = await Photo.bulkCreate(photosList);

  return photos;
};

export const getPhotos = async (payload) => {
  const { entityType, entityId } = payload;

  const photos = await Photo.findAll({
    where: {
      entityType,
      entityId,
    },
  });

  return photos;
};

export const deletePhotos = async (payload) => {
  const { entityType, entityId, photoId } = payload;

  let where = {
    entityType,
    entityId,
  };

  if (photoId) where.photoId = photoId;

  const destroyedCount = await Photo.destroy({
    where,
  });

  return destroyedCount;
};