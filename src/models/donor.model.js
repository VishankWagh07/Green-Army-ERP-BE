import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Donor = sequelize.define(
  "Donor",
  {
    donorId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
    },
    address: {
      type: DataTypes.STRING(300),
    },
    panNumber: {
      type: DataTypes.STRING(10),
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    anniversaryDate: {
      type: DataTypes.DATE,
    },
    assignedUserId: {
      type: DataTypes.UUID,
    },
    isActive: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "DonorMaster",
    timestamps: true,
  },
);

Donor.associate = (models) => {
  Donor.belongsTo(models.User, {
    foreignKey: "assignedUserId",
    as: "assignedUser",
  });
  Donor.hasMany(models.Donation, {
    foreignKey: "donorId",
    as: "donations",
  });
  Donor.hasMany(models.Plantation, {
    foreignKey: "donorId",
    as: "plantations",
  });
};

export const Donation = sequelize.define(
  "Donation",
  {
    donationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    donorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(2),
      allowNull: false,
    },
    donationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stickersPrepared: {
      type: DataTypes.NUMBER(),
      defaultValue: 0,
      allowNull: false,
    },
    paymentMode: {
      type: DataTypes.STRING(50),
    },
    paymentStatus: {
      type: DataTypes.ENUM('Pending','Completed'),
      defaultValue: 'Pending',
      allowNull: false,
    },
    plantationStatus: {
      type: DataTypes.ENUM('Pending','Completed'),
      defaultValue: 'Pending',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Donations",
    timestamps: true,
  },
);

Donation.associate = (models) => {
  Donation.belongsTo(models.Donor, {
    foreignKey: "donorId",
    as: "donor",
  });
  Donation.hasMany(models.Plantation, {
    foreignKey: "donationId",
    as: "plantations",
  });
};
