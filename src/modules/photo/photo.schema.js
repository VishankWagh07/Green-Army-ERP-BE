import z from "zod";
import { PHOTO_ENTITY_TYPES } from "../../constants/common.js";

export const entitySchema = z.object({
  entityType: z.enum(Object.values(PHOTO_ENTITY_TYPES)),
  entityId: z.uuidv4(),
});

export const entityPhotoSchema = entitySchema.extend({
    photoId: z.uuidv4(),
})