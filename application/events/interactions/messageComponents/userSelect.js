// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.UserSelect,

    // Handling interaction
    async execute(interaction) {
        // Searching for user select component
        const userSelectComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId.replace(/[0-9]/g, ""));

        // Checking if user select component was found
        if (userSelectComponent) {
            // Trying to execute user select component specific script
            await userSelectComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if user select component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this user select interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The user select component ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No user select component matching ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} was found`
            );
        }
    },
};
