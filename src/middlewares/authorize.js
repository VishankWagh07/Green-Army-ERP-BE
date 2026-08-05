import { ApiError } from "../utils/ApiError.js";

/**
 * Usage: authorize(['admin', 'donor_relations'])
 * Must run after authenticate. Row-level ownership checks (e.g. a
 * field_staff only touching their own attendance) belong in the
 * service layer, not here - this only checks the coarse role.
 */
export const authorize = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }
  if (!allowedRoles.includes(req.user.role)) {
    return next(ApiError.forbidden(`Role '${req.user.role}' cannot access this resource`));
  }
  next();
};