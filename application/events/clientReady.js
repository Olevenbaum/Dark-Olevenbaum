// Importing classes and methods
const { Events } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../configuration.json");

module.exports = {
    // Setting event name and kind
    name: Events.ClientReady,
    once: true,

    // Handling event
    async execute(client) {
        // Creating array for promises to be executed to start the application
        const promises = [];

        // Adding update of new or deleted commands to promises
        promises.push(require("../refreshCommands.js")(client));

        // Adding update of new or deleted models in database to promises
        if (client.sequelize) {
            promises.push(
                require("../../database/initializeDatabase.js")(
                    client.sequelize
                )
            );
        }

        // Executing promises
        await Promise.all(promises).catch((error) =>
            console.error("[ERROR]".padEnd(consoleSpace), ":", error)
        );

        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Successfully logged in as ${client.user.username}`
        );
    },
};
