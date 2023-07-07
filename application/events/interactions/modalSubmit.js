// Importing classes and methods
const { InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

module.exports = {
    // Setting interaction type
    type: InteractionType.ModalSubmit,

    // Handling interaction
    async execute(interaction) {
        // Executing interaction type specific script
        interaction.client.modals
            .get(interaction.customId)
            .execute(interaction)
            .catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );
    },
};
