// Importing classes and methods
const { ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: ComponentType.RoleSelect,

    // Handling interaction
    async execute(interaction) {
        const messageComponent = interaction.client.messageComponents
            .filter((messageComponent) => messageComponent.type === this.name)
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
