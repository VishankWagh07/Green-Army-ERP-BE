import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
    frequencyDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "WateringLocations",
    timestamps: true,
  },
);

WateringLocation.associate = (models) => {
  WateringLocation.belongsTo(models.Plantation, {
    foreignKey: "plantationId",
    as: "plantation",
  });
  WateringLocation.hasMany(models.WateringSchedule, {
    foreignKey: "wateringLocationId",
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
    location: {
      type: DataTypes.GEOMETRY("POINT", 4326),
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
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignedUserId: {
      type: DataTypes.UUID,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.STRING(300),
    },
  },
  {
    tableName: "WateringSchedules",
    timestamps: true,
  },
);

WateringSchedule.associate = (models) => {
  WateringSchedule.belongsTo(models.WateringLocation, {
    foreignKey: "wateringLocationId",
    as: "wateringLocation",
  });
  WateringSchedule.belongsTo(models.User, {
    foreignKey: "assignedUserId",
    as: "assignedUser",
  });
};
