import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import env from "./env.js";

dotenv.config();

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_SERVER,
    port: env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            instanceName: env.DB_SERVER_INSTANCE,
            encrypt: env.DB_ENCRYPT,
            trustServerCertificate: env.DB_TRUST_SERVER_CERT,
        },
    },
    pool: { max: 10, min: 0, idle: 30000 },
    //   logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    define: { timestamps: false },
});

async function connectDb() {
    try {
        await sequelize.authenticate();
        // logger.info(`Connected to MSSQL via Sequelize: ${env.DB_NAME}@${env.DB_SERVER}`);
        console.log('Connection has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function closeDb() {
    await sequelize.close();
}

export { sequelize, connectDb, closeDb };