// src/models/nursery.model.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { STOCK_LOG_REFS } from "../constants/common";

  export const Nursery = sequelize.define(
    "Nursery",
    {
      saplingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      treeName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "Nursery",
      timestamps: true,
      freezeTableName: true,
    }
  );

  Nursery.associate = (models) => {
    Nursery.hasMany(models.StockLog, {
      foreignKey: "saplingId",
      as: "stockLogs",
    });
  };


  export const StockLog = sequelize.define(
    "StockLog",
    {
      logId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      saplingId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
          isIn: [["IN", "OUT"]],
        },
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      referenceType: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          isIn: [Object.keys(STOCK_LOG_REFS)],
        },
      },

      referenceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      logDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "StockLogs",
      timestamps: false,
      freezeTableName: true,
    }
  );

  StockLog.associate = (models) => {
    // Stock log belongs to a nursery sapling
    StockLog.belongsTo(models.Nursery, {
      foreignKey: "saplingId",
      as: "sapling",
    });

    // Optional polymorphic association to Plantation
    StockLog.belongsTo(models.Plantation, {
      foreignKey: "referenceId",
      constraints: false,
      as: "plantation",
    });

    // Optional polymorphic association to Donation
    StockLog.belongsTo(models.Donation, {
      foreignKey: "referenceId",
      constraints: false,
      as: "donation",
    });
  };