import { REFRESH_COOKIE_OPTIONS } from "../../constants/auth.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { login, refresh, register } from "./auth.service.js";

// login controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { user } = await login(email, password);
  sendSuccess(res, { data: { user } });
}

// rgister controller
export const registerController = async (req, res) => {
  const { user } = await register(req.body);
  sendSuccess(res, { data: { user } });
}

// logout controller
export const logoutController = async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Logout successful"
    });
  });
  
  sendSuccess(res, { data: { loggedOut: true } });
}

// refresh controller
// export const refreshController = async (req, res) => {
//   const {refreshToken} = req.body;
//   const { accessToken } = await refresh(refreshToken);
//   sendSuccess(res, { data: { accessToken } });
// }