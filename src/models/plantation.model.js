// src/models/plantation.model.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Plantation = sequelize.define(
    "Plantation",
    {
        plantationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        plantationDate: {
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

        location: {
            type: DataTypes.GEOMETRY("POINT", 4326),
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        teamId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        donorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        donationId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        treesPlanted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        treeGuards: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
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
        tableName: "Plantation",
        timestamps: true,
        freezeTableName: true,
    }
);

Plantation.associate = (models) => {
    // Plantation belongs to a Team
    Plantation.belongsTo(models.Team, {
        foreignKey: "teamId",
        as: "team",
    });

    // Plantation belongs to a Donor (optional)
    Plantation.belongsTo(models.Donor, {
        foreignKey: "donorId",
        as: "donor",
    });

    // Plantation belongs to a Donation (optional)
    Plantation.belongsTo(models.Donation, {
        foreignKey: "donationId",
        as: "donation",
    });

    // Plantation created by a User
    Plantation.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "createdByUser",
    });

    // Plantation has many watering locations
    Plantation.hasOne(models.WateringLocation, {
        foreignKey: "plantationId",
        as: "wateringLocation",
    });
};