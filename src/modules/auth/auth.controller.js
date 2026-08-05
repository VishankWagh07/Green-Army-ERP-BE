import { REFRESH_COOKIE_OPTIONS } from "../../constants/auth.js";
import { sendSuccess } from "../../utils/ApiResponse.js";
import { login, refresh, register } from "./auth.service.js";

// login controller
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await login(email, password);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { accessToken, user } });
}

// rgister controller
export const registerController = async (req, res) => {
  const { accessToken, refreshToken, user } = await register(req.body);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { accessToken, user } });
}

// refresh controller
export const refreshController = async (req, res) => {
  const {refreshToken} = req.body;
  const { accessToken } = await refresh(refreshToken);
  sendSuccess(res, { data: { accessToken } });
}

// logout controller
export const logoutController = async (req, res) => {
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { loggedOut: true } });
}