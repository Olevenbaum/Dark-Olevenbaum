// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting command type
    type: ApplicationCommandType,

    // Handling interaction
    async execute(interaction) {
        const command = interaction.client.commands
            .get(interaction.commandName)
            .filter((command) => command.type === this.type);
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
