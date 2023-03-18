// Importing classes
const { InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

module.exports = {
    // Setting interaction type name
    name: InteractionType.ApplicationCommandAutocomplete,
    // Handling interaction
    async execute(interaction) {
        const slashCommand = interaction.client.slashCommands.get(
            interaction.commandName
        );
        await slashCommand
            .autocomplete(interaction)
            .catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );
    },
};
