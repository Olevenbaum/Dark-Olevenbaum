// Importing classes and methods
const { Events } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../configuration.json");

module.exports = {
    // Setting event kind and type
    once: true,
    type: Events.ClientReady,

    // Handling event
    async execute(client) {
        // Creating array for promises to be executed to start the application
        const promises = [];

        // Adding update of new or deleted application commands to promises
        promises.push(require("../refreshCommands.js")(client));

        // Checking if database is enabled
        if (client.sequelize) {
            // Adding update of new or deleted models in database to promises
            promises.push(
                require("../../database/initializeDatabase.js")(
                    client.sequelize
                )
            );
        }

        // Executing promises
        await Promise.all(promises).catch((error) =>
            // Printing error
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

        // Printing info
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Successfully logged in as ${client.user.username}`
        );
    },
};
