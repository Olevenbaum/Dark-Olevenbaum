// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.StringSelect,

    // Handling interaction
    async execute(interaction) {
        // Searching for string select component
        const stringSelectComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId);

        // Checking if string select component was found
        if (stringSelectComponent) {
            // Trying to execute string select specific script
            await stringSelectComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if string select component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sedning follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this string select interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The string select component ${interaction.customId} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No string select component matching ${interaction.customId} was found`
            );
        }
    },
};
