// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: ApplicationCommandType.ChatInput,

    // Handling interaction
    async execute(interaction) {
        const slashCommand = interaction.client.slashCommands.get(
            interaction.commandName
        );
        if (!slashCommand) {
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No slash command matching ${interaction.commandName} was found`
            );
            return;
        }
        await slashCommand.execute(interaction).catch(async (error) => {
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
