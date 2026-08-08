import session from "express-session";
import SequelizeStoreFactory from "connect-session-sequelize";
import { SEVEN_DAYS, THIRTY_DAYS } from "../constants/common.js";
import { sequelize } from "./db.js";
import { Session as SessionModel } from "../models/auth.model.js";

const SequelizeStore = SequelizeStoreFactory(session.Store);

const extendDefaultFields = (defaults, sessionData) => ({
    data: defaults.data,
    expires: defaults.expires,
    userId: sessionData.userId,
    absoluteExpiresAt: sessionData.absoluteExpiresAt ?? new Date(Date.now() + THIRTY_DAYS),
});

const sessionStore = new SequelizeStore({
    db: sequelize,
    table: SessionModel.name,
    modelKey: SessionModel.name,
    checkExpirationInterval: 15 * 60 * 1000, // Clean up expired database records every 15 mins
    expiration: SEVEN_DAYS, // Idle timeout: Sessions inactive for 7 days will expire
    extendDefaultFields,
});

export default sessionStore;