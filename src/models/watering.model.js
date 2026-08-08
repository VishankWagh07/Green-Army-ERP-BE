import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const WateringLocation = sequelize.define(
  "WateringLocation",
  {
    wateringLocationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    plantationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    locationName: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    googleMapsLink: {
      type: DataTypes.STRING(500),
    },
    frequencyDays: {
      type: DataTypes.NUMBER(),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "WateringLocations",
    timestamps: true,
  },
);

WateringLocation.associate = (models) => {
    WateringLocation.belongsTo(models.Plantation, {
      as: "plantation",
    });
  WateringLocation.hasMany(models.WateringSchedule, {
    as: "wateringSchedules",
  });
};

export const WateringSchedule = sequelize.define(
  "WateringSchedule",
  {
    scheduleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    wateringLocationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignedUserId: {
      type: DataTypes.UUID,
    },
    reminderTime: {
      type: DataTypes.TIME(),
    },
    isCompleted: {
      type: DataTypes.BOOLEAN(),
      defaultValue: 0,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE(),
    },
    notes: {
      type: DataTypes.STRING(300),
    },
  },
  {
    sequelize,
    tableName: "WateringSchedules",
    timestamps: true,
  },
);

WateringSchedule.associate = (models) => {
  WateringSchedule.belongsTo(models.WateringLocation, {
    as: "wateringLocation",
  });
  WateringSchedule.belongsTo(models.User, {
    foreignKey: "assignedUserId",
    as: "assignedUser",
  });
};
