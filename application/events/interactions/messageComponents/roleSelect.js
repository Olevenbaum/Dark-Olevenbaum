// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.RoleSelect,

    // Handling interaction
    async execute(interaction) {
        // Searching for role select component
        const roleSelectComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId.replace(/[0-9]/g, ""));

        // Checking if role select component was found
        if (roleSelectComponent) {
            // Trying to execute role select component specific script
            await roleSelectComponent.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if role select component interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this role select interaction!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The role select component ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No role select component matching ${interaction.customId.replace(
                    /[0-9]/g,
                    ""
                )} was found`
            );
        }
    },
};
