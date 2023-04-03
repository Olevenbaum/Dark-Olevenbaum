// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: ApplicationCommandType.ChatInput,

    // Handling interaction
    async execute(interaction) {
        const command = interaction.client.commands
            .get(interaction.commandName)
            .filter((command) => command.type === this.name);
        if (!command) {
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No command matching ${interaction.commandName} was found`
            );
            return;
        }
        await command.execute(interaction).catch(async (error) => {
            console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content:
                        "There was an error while executing this slash command!",
                    ephemeral: true,
                });
            }
        });
    },
};
