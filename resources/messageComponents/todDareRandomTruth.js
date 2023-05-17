// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todDareRandomTruth",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.Button &&
                        (messageComponent.name === "todDare" ||
                            messageComponent.name === "todRandom" ||
                            messageComponent.name === "todTruth")
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
