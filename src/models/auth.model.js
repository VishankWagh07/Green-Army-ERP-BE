// src/models/user.model.js
import { sequelize } from '../config/db.js';
import { DataTypes } from "sequelize";
import { ROLES } from '../constants/common.js';

export const User = sequelize.define(
    "User",
    {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM(Object.keys(ROLES)),
            allowNull: false,
        },

        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },

        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        mobileNumber: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },

        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        teamId: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        joiningDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "UserMaster",
        timestamps: true,
        freezeTableName: true,
    }
);

User.associate = (models) => {
    // User belongs to a Team
    User.belongsTo(models.Team, {
        foreignKey: "teamId",
        as: "team",
    });

    // User manages many Donors
    User.hasMany(models.Donor, {
        foreignKey: "assignedUserId",
        as: "assignedDonors",
    });

    // User created many Plantations
    User.hasMany(models.Plantation, {
        foreignKey: "createdBy",
        as: "createdPlantations",
    });

    // User has many Daily Logs
    User.hasMany(models.EmployeeDailyLog, {
        foreignKey: "userId",
        as: "dailyLogs",
    });

    // User has many Attendance records
    User.hasMany(models.Attendance, {
        foreignKey: "userId",
        as: "attendance",
    });

    // User is assigned many Watering Schedules
    User.hasMany(models.WateringSchedule, {
        foreignKey: "assignedUserId",
        as: "wateringSchedules",
    });

    // User uploaded many Photos
    User.hasMany(models.Photo, {
        foreignKey: "uploadedBy",
        as: "uploadedPhotos",
    });
};