// src/models/employeeDailyLog.model.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { ATTENDANCE_STATUS } from "../constants/common";

export const EmployeeDailyLog = sequelize.define(
    "EmployeeDailyLog",
    {
      logId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      logDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      locationName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      googleMapLink: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "EmployeeDailyLogs",
      timestamps: false,
      freezeTableName: true,
    }
  );

  EmployeeDailyLog.associate = (models) => {
    // Daily log belongs to a user
    EmployeeDailyLog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    // Daily log can have many photos
    EmployeeDailyLog.hasMany(models.Photo, {
      foreignKey: "entityId",
      sourceKey: "logId",
      constraints: false,
      scope: {
        entityType: "EMPLOYEE_DAILY_LOG",
      },
      as: "photos",
    });
  };


  export const Attendance = sequelize.define(
    "Attendance",
    {
      attendanceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      attendanceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isIn: [Object.keys(ATTENDANCE_STATUS)],
        },
      },

      checkInTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },

      checkOutTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Attendance",
      timestamps: false,
      freezeTableName: true,

      indexes: [
        {
          unique: true,
          fields: ["userId", "attendanceDate"],
          name: "UQ_Attendance",
        },
      ],
    }
  );

  Attendance.associate = (models) => {
    // Attendance belongs to a User
    Attendance.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };