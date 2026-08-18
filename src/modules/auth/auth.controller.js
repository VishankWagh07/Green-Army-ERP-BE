import { THIRTY_DAYS } from "../../constants/common.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { destroyUserSession, findActiveUserSession, login, register } from "./auth.service.js";

const persistSession = (req, user) => {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        return reject(ApiError.internal("Failed to regenerate session"));
      }

      req.session.userId = user.userId;
      req.session.absoluteExpiresAt = new Date(Date.now() + THIRTY_DAYS);

      req.session.save((saveError) => {
        if (saveError) {
          console.log("sv er", saveError);

          return reject(ApiError.internal("Failed to save session"));
        }

        resolve();
      });
    });
  });
};

const destroySession = (req) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        return reject(ApiError.internal("Failed to destroy session"));
      }

      resolve();
    });
  });
};

// login controller
export const loginController = async (req, res, next) => {
  try {
    const { email, password, replaceExistingSession } = req.body;
    const { user } = await login(email, password);

    const existingSession = await findActiveUserSession(user.userId);

    if (existingSession && !replaceExistingSession) {
      throw ApiError.conflict("This user is already logged in on another device.");
    }

    if (existingSession && replaceExistingSession) {
      await destroyUserSession(user.userId);
    }

    await persistSession(req, user);

    return sendSuccess(res, { data: { user } });
  } catch (error) {
    return next(error);
  }
};

// register controller
export const registerController = async (req, res, next) => {
  try {
    const { user } = await register(req.body);
    await persistSession(req, user);

    return sendSuccess(res, { data: { user } });
  } catch (error) {
    return next(error);
  }
};

// logout controller
export const logoutController = async (req, res, next) => {
  try {
    await destroySession(req);
    res.clearCookie("connect.sid");

    return sendSuccess(res, { data: { loggedOut: true } });
  } catch (error) {
    return next(error);
  }
};

// refresh controller
// export const refreshController = async (req, res) => {//   const {refreshToken} = req.body;//   const { accessToken } = await refresh(refreshToken);//   sendSuccess(res, { data: { accessToken } });// }