// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "joinOrStart",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.Button &&
                        (messageComponent.name === "todJoin" ||
                            messageComponent.name === "todStart")
                )
                .map((messageComponent) => messageComponent.create())
        );
    },

    // Handling interaction
    async execute(interaction) {},
};
