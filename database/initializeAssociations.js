// Importing configuration data
const { consoleSpace } = require("../configuration.json");

module.exports = async (sequelize) => {
    const models = sequelize.models;

    // Associations

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "All associatios have been created"
    );
};
