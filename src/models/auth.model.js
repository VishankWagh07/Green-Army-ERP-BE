// src/models/user.model.js
import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";
import { USER_ROLES } from "../constants/auth.js";

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
      type: DataTypes.ENUM(Object.keys(USER_ROLES)),
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
  },
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

  // User Sessions
  User.hasMany(models.Session, {
    foreignKey: "userId",
    as: "sessions",
  });
};

export const Session = sequelize.define(
  "Session",
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: {
      type:DataTypes.DATE,
    },
    data: {
      type:DataTypes.TEXT,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    absoluteExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Sessions",
    // timestamps: true,
  },
);

Session.associate = (models) => {
  Session.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};
