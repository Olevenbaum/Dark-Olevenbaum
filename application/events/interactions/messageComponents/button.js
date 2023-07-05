// Importing classes and methods
const { ComponentType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting message component type
    type: ComponentType.Button,

    // Handling interaction
    async execute(interaction) {
        const messageComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.type)
            .get(interaction.customId);
        if (!messageComponent) {
            await interaction.reply(
                `The message component ${interaction.customId} could not be found.`
            );
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No message component matching ${interaction.customId} was found`
            );
            return;
        }
        await messageComponent.execute(interaction).catch(async (error) => {
            console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content:
                        "There was an error while executing this button interaction!",
                    ephemeral: true,
                });
            }
        });
    },
};
