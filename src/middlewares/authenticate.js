import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from './asyncHandler.js';
import env from "../config/env.js"

/**
 * Verifies the access token and attaches req.user = { userId, employeeId, role, teamId }.
 * Does NOT hit the database - the JWT payload is the source of truth for the
 * lifetime of the access token (15 min), keeping auth cheap on every request.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Missing or malformed Authorization header');
  }

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    
    req.user = {
      userId: payload.sub,
      role: payload.role,
      teamId: payload.teamId,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'TOKEN_EXPIRED', 'Access token expired');
    }
    throw ApiError.unauthorized('Invalid access token');
  }
});