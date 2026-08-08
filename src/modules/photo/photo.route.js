import express from 'express'
import upload from '../../middlewares/upload.js';
import asyncHandler from '../../middlewares/asyncHandler.js';
import { addPhotosController, deletePhotosController, getPhotosController } from './photo.controller.js';
import { validate } from '../../middlewares/validate.js';
import { entityPhotoSchema, entitySchema } from './photo.schema.js';
import { authenticate } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/:entityType/:entityId', authenticate, validate({ params: entitySchema }), upload.array('photos'), asyncHandler(addPhotosController));

router.get('/:entityType/:entityId', authenticate, validate({ params: entitySchema }), asyncHandler(getPhotosController));

router.delete('/:entityType/:entityId/:photoId', authenticate, validate({ params: entitySchema }), asyncHandler(deletePhotosController));

export default router;