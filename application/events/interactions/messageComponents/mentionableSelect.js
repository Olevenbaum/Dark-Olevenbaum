// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.MentionableSelect,

    // Handling interaction
    async execute(interaction) {
        // Searching for mentionable select component
        const mentionableSelectComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId.replace(/[0-9]/g, ""));

        // Checking if mentionable select component was found
        if (mentionableSelectComponent) {
            // Trying to execute mentionable component specific script
            await mentionableSelectComponent
                .execute(interaction)
                .catch((error) => {
                    // Printing error
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                    // Checking if mentionable select component interaction was acknowledged
                    if (interaction.replied || interaction.deferred) {
                        // Sending follow up message
                        interaction.followUp({
                            content:
                                "There was an error while executing this mentionable select interaction!",
                            ephemeral: true,
                        });
                    }
                });
        } else {
            // Replying to interaction
            interaction.reply(
                `The mentionable select component ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No mentionable select component matching ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} was found`
            );
        }
    },
};
