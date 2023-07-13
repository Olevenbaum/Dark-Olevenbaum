// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.ChannelSelect,

    // Handling interaction
    async execute(interaction) {
        // Searching for channel select component
        const channelselectComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId);

        // Checking if channel select component was found
        if (channelselectComponent) {
            // Trying to execute command specific script
            await channelselectComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if channel select component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this channel select component interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The channel select component ${interaction.customId} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No channel select component matching ${interaction.customId} was found`
            );
        }
    },
};
