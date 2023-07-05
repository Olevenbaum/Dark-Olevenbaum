// Importing classes and methods
const { ComponentType } = require("discord.js");

module.exports = {
    // Setting message component type
    type: ComponentType,

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
    },
};
