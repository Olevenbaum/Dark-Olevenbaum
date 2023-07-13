// Importing classes and methods
const { ComponentType } = require("discord.js");

module.exports = {
    // Setting message component type
    type: ComponentType,

    // Handling interaction
    async execute(interaction) {
        // Searching for message component
        const messageComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId);

        // Checking if message component was found
        if (messageComponent) {
            // Trying to execute message component specific script
            await messageComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if message component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this message component interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The message component ${interaction.customId} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No message component matching ${interaction.customId} was found`
            );
        }
    },
};
