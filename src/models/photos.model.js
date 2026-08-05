import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/db";
import { PHOTOS_ENTITY_TYPES } from "../constants/common";

class Photos extends Model {
    static associate(models) {
      Photos.belongsTo(models.Employee, { foreignKey: 'assignedUserId', as: 'assignedEmployee' });
      Photos.hasMany(models.Donation, { foreignKey: 'donorId', as: 'donations' });
    }
  }
  
  Photos.init(
    {
      photoId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.ENUM(...Object.values(PHOTOS_ENTITY_TYPES)),
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
      }
    },
    {
      sequelize,
      tableName: 'Photos',
      timestamps: false
    }
  );
 
  export default Photos;