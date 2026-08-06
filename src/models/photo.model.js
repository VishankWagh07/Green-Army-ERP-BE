import { DataTypes } from "sequelize";
import { PHOTO_ENTITY_TYPES, ROLES } from "../constants/common.js";
import { sequelize } from "../config/db.js";

export const Photo = sequelize.define(
  "Photo",
  {
    photoId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.ENUM(...Object.values(PHOTO_ENTITY_TYPES)),
      defaultValue: ROLES.EMPLOYEE,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Photos",
    timestamps: false,
  },
);

Photo.associate = (models) => {
  Photo.belongsTo(models.User, {
    foreignKey: "userId",
    as: "uploadedBy",
  });
};

export default Photo;
