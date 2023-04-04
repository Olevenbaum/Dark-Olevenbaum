// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: ApplicationCommandType.ChatInput,

    // Handling interaction
    async execute(interaction) {
        const command = interaction.client.commands
            .filter((command) => command.type === this.name)
            .get(interaction.commandName);
        if (!command) {
            await interaction.reply(
                `The command ${interaction.commandName} could not be found.`
            );
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
