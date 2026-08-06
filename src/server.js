import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./config/db.js";
import env from "./config/env.js";
// import authRoutes from "./modules/auth/auth.route.js";
import photoRoutes from "./modules/photo/photo.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { uploadDirectory } from "./middlewares/upload.js";

const app = express();

const PORT = env.SERVER_PORT || 5050;

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// An uploaded photo is publicly available at `/uploads/...`
app.use('/uploads', express.static(uploadDirectory));

// app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/photos', photoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT,()=>{
    connectDb();
    console.log("Server running on port:",PORT);
})
