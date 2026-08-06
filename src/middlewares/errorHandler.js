// import logger from '../utils/logger';

import env from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.log("SQL details:", err.original?.message || err.parent?.message || err.sqlMessage || err.detail);
  console.log("Full error object:", JSON.stringify(err, null, 2));
  
  const isOperational = err instanceof ApiError || err.isOperational;

  if (!isOperational) {
    // Unexpected bug - log full detail, never leak internals to the client.
    console.error(err);
  } else if (err.statusCode >= 500) {
    console.error(err);
  }

  const statusCode = isOperational ? err.statusCode : 500;
  const code = isOperational ? err.code : 'INTERNAL_ERROR';
  const message = isOperational ? err.message : 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: isOperational ? err.details : undefined,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
}
