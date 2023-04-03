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
        // Updating new or deleted slash commands
        await require("../refreshCommands.js")(client);

        // Updating new or deleted models in database
        await require("../../database/initializeDatabase.js")(client.sequelize);

        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Discord bot logged in successfully as ${client.user.username}`
        );
    },
};
