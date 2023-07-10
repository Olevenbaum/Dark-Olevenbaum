// Importing classes and methods
const { ApplicationCommandType, InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

module.exports = {
    // Setting interaction type
    type: InteractionType.ApplicationCommandAutocomplete,

    // Handling interaction
    async execute(interaction) {
        // Searching for chat input command
        const chatInputCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) =>
                    applicationCommand.type === ApplicationCommandType.ChatInput
            )
            .get(interaction.commandName);

        // Checking if chat input command was found
        if (chatInputCommand) {
            // Trying to execute chat input command specific script
            await chatInputCommand
                .autocomplete(interaction)
                .catch(async (error) => {
                    // Printing error
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);
                });
        } else {
            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No chat input command matching ${interaction.commandName} was found`
            );
        }
    },
};
