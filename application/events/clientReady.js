// Importing classes
const { Events } = require("discord.js");

module.exports = {
    // Setting event name
    name: Events.ClientReady,
    // Handling event
    async execute(client) {
        // Updating new or deleted slash commands
        require("../refreshCommands.js")(client);

        // Updating new or deleted models in database
        require("../../database/initializeDatabase.js")(client.sequelize);

        console.info(
            "[INFORMATION]".padEnd(15),
            ": ",
            `Discord bot logged in successfully as ${client.user.tag}`
        );
    },
    once: true,
};
