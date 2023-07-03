// Importing classes and methods
const { DataTypes } = require("sequelize");

module.exports = async (sequelize) => {
    // Defining model
    return await sequelize.define(
        "tod",
        {
            id: {
                primaryKey: true,
                type: DataTypes.STRING,
            },
            text: {
                allowNull: false,
                type: DataTypes.STRING,
            },
        },

        // Options
        {}
    );
};
