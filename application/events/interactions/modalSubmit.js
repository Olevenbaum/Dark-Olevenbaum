// Importing classes and methods
const { InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

module.exports = {
    // Setting interaction type
    type: InteractionType.ModalSubmit,

    // Handling interaction
    async execute(interaction) {
        // Searching for modal
        const modal = interaction.client.modals.get(interaction.customId);

        // Checking if modal was found
        if (modal) {
            // Trying to execute modal specific script
            await modal.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            });
        } else {
            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No modal matching ${interaction.customId} was found`
            );
        }
    },
};
