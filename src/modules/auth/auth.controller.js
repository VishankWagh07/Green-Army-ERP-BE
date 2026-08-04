import { sendSuccess } from "../../utils/ApiResponse.js";
import { REFRESH_COOKIE_OPTIONS } from "./auth.constants.js";
import { login } from "./auth.service.js";

// Login controller
export const loginController = async (req, res) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken, user } = await login(username, password);
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  sendSuccess(res, { data: { accessToken, user } });
}