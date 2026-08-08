import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

import { connectDb } from "./config/db.js";
import env from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.route.js";
import sessionStore from "./config/session.js";
import { SEVEN_DAYS, THIRTY_DAYS } from "./constants/common.js";
import photoRoutes from "./modules/photo/photo.route.js";
import userRoutes from "./modules/user/user.route.js";
import teamRoutes from "./modules/team/team.route.js";
import { uploadDirectory } from "./middlewares/upload.js";

const app = express();

const PORT = env.SERVER_PORT || 5050;

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
    store:sessionStore,
    secret: 'session_cookie_secret_key',
    resave: false,
    saveUninitialized: false,
    rolling: true, // Crucial: Resets the 7-day idle cookie on every user request
    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SEVEN_DAYS
    }
}))

// An uploaded photo is publicly available at `/uploads/...`
app.use('/uploads', express.static(uploadDirectory));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/photos', photoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDb();
    console.log("Server running on port:", PORT);
})
