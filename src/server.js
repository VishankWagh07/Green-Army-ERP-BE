import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

import { connectDb } from "./config/db.js";
import env from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.route.js";
import sessionStore from "./config/session.js";
import { THIRTY_DAYS } from "./constants/common.js";

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
    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: THIRTY_DAYS
    }
}))

app.use('/api/v1/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    connectDb();
    console.log("Server running on port:", PORT);
})