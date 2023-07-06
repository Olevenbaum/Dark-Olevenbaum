// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components components, name and type
    messageComponents: ["todCustomTruthOrDare", "todRandomTruthOrDare"],
    name: "todCustomOrRandom",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.Button &&
                        this.messageComponents.includes(messageComponent.name)
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
