export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} code - machine-readable error code, e.g. 'NOT_FOUND'
   * @param {string} message - human-readable message
   * @param {any[]} [details] - optional validation error details
   */
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // distinguishes expected errors from bugs
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) { return new ApiError(400, 'BAD_REQUEST', message, details); }
  static unauthorized(message = 'Unauthorized') { return new ApiError(401, 'UNAUTHORIZED', message); }
  static forbidden(message = 'Forbidden') { return new ApiError(403, 'FORBIDDEN', message); }
  static notFound(message = 'Not found') { return new ApiError(404, 'NOT_FOUND', message); }
  static conflict(message) { return new ApiError(409, 'CONFLICT', message); }
  static internal(message = 'Internal server error') { return new ApiError(500, 'INTERNAL_ERROR', message); }
}