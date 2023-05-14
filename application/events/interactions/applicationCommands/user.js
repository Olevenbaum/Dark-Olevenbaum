// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting interaction type name
    name: ApplicationCommandType.User,

    // Handling interaction
    async execute(interaction) {
        const command = interaction.client.commands
            .filter((command) => command.type === this.name)
            .get(interaction.commandName);
        if (!command) {
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No command matching ${interaction.commandName} was found`
            );
            return;
        }
    },
};
