import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/auth.model.js";

// Session Authenticate

export const authenticate = async (req, res, next) => {
  // no session / no userId
  if (!req.session?.userId) {
    next(ApiError.unauthorized("Please log in first."));
  }

  try {
    // absolute expiry -> clear session
    if (
      !req.session.absoluteExpiresAt ||
      new Date(Date.now()).getTime() >= new Date(req.session.absoluteExpiresAt).getTime()
    ) {
      return req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid"); // Clears default session cookie

        next(ApiError.unauthorized("Session Expired. Please log in again."));
      });
    }

    // verify userId
    const user = await User.findByPk(req.session.userId);

    if (!user) next(ApiError.notFound("User not found"));

    req.user = { userId: user.userId, fullName: user.fullName, email: user.email, role: user.role };

    next();

  } catch (error) {
    next(error);
  }
};


/**
 * Usage: authorize(['admin', 'donor_relations'])
 * Must run after authenticate. Row-level ownership checks (e.g. a
 * field_staff only touching their own attendance) belong in the
 * service layer, not here - this only checks the coarse role.
 */
export const authorize =
  (allowedRoles = []) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' cannot access this resource`,
        ),
      );
    }
    next();
  };



// token authenticate

/**
 * Verifies the access token and attaches req.user = { userId, employeeId, role, teamId }.
 * Does NOT hit the database - the JWT payload is the source of truth for the
 * lifetime of the access token (15 min), keeping auth cheap on every request.
 */
// export const authenticate = asyncHandler(async (req, res, next) => {
//   const header = req.headers.authorization || "";
//   const [scheme, token] = header.split(" ");

//   if (scheme !== "Bearer" || !token) {
//     throw ApiError.unauthorized("Missing or malformed Authorization header");
//   }

//   try {
//     const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

//     req.user = {
//       userId: payload.sub,
//       role: payload.role,
//       teamId: payload.teamId,
//     };
//     next();
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       throw new ApiError(401, "TOKEN_EXPIRED", "Access token expired");
//     }
//     throw ApiError.unauthorized("Invalid access token");
//   }
// });