// Importing classes
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "session",
        {
            active: {
                allowNull: false,
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            confirmed: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.INTEGER,
            },
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            rating: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.INTEGER,
            },
            skips: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.INTEGER,
            },
        },

        // Options
        {}
    );
};
