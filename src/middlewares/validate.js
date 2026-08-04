import { ApiError } from "../utils/ApiError.js";

export const validate = (schemas = {}) => (req, res, next) => {
  for (const key of ['body', 'query', 'params']) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key]);
    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors));
    }
    
    if (key === "query") {
      // Don't replace req.query
      Object.assign(req.query, result.data);
    } else {
      req[key] = result.data;
    }
  }
  next();
};
