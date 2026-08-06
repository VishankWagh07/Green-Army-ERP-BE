import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Team = sequelize.define(
  "Team",
  {
    teamId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    teamName: {
      type: DataTypes.STRING(100),
      unique: true,
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
    tableName: "TeamMaster",
    timestamps: true,
  },
);

Team.associate = (models) => {
  Team.hasMany(models.User, {
    foreignKey: "teamId",
    as: "teamMembers",
  });
  Team.hasMany(models.Plantation, {
    foreignKey: "teamId",
    as: "plantations",
  });
};