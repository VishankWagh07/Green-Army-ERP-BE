export const USER_ROLES = {
    ADMIN: "ADMIN",
    TEAM_MANAGER: "TEAM_MANAGER",
    EMPLOYEE: "EMPLOYEE",
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};