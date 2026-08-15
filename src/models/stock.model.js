import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { STOCK_TYPES } from "../constants/common.js";

export const StockVariant = sequelize.define(
  "StockVariant",
  {
    variantId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(Object.values(STOCK_TYPES)),
      allowNull: false,
      defaultValue: "SAPLING"
    },

    variantName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "StockVariants",
    timestamps: true,
    freezeTableName: true,
  }
);

StockVariant.associate = (models) => {
  StockVariant.hasMany(models.Stock, {
    foreignKey: "variantId",
    as: "stocks",
  });
};


export const Stock = sequelize.define(
  "Stock",
  {
    stockId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    donationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    variantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    quantityBought: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantityAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Stock",
    timestamps: true,
    freezeTableName: true,
  }
);

Stock.associate = (models) => {
  Stock.belongsTo(models.Donation, {
    foreignKey: "donationId",
    as: "donation",
  });

  Stock.belongsTo(models.StockVariant, {
    foreignKey: "variantId",
    as: "variant",
  });

  Stock.hasMany(models.PlantationStockUsage, {
    foreignKey: "stockId",
    as: "plantationUsages",
  });
};


export const PlantationStockUsage = sequelize.define(
  "PlantationStockUsage",
  {
    usageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    plantationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    stockId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "PlantationStockUsage",
    timestamps: true,
    freezeTableName: true,
  }
);

PlantationStockUsage.associate = (models) => {
  PlantationStockUsage.belongsTo(models.Plantation, {
    foreignKey: "plantationId",
    as: "plantation",
  });

  PlantationStockUsage.belongsTo(models.Stock, {
    foreignKey: "stockId",
    as: "stock",
  });
};