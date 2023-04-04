// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: ApplicationCommandType.Message,

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
