// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todSessionStart",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.Button &&
                        messageComponent.name === "todStart"
                )
                .map((messageComponent) =>
                    messageComponent.create(interaction, {
                        ...options.general,
                        ...options[messageComponent.name],
                    })
                )
        );
    },

    // Handling interaction
    async execute(interaction) {},
};
