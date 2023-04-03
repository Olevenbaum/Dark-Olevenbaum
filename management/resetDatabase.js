// Importing classes and methods
const { Sequelize } = require("sequelize");

// Importing configuration data
const { consoleSpace, database } = require("../configuration.json");

if (database) {
    // Creating new sequelize object
    const sequelize = new Sequelize(database);

    // Forcing syncronisation of database
    sequelize.sync({ force: true }).catch((error) => {
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
    });

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "Successfully reset database"
    );
} else {
    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        "You cannot use this script when not using a database"
    );
}
