// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "endOrLeave",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.Button &&
                        (messageComponent.name === "todEnd" ||
                            messageComponent.name === "todLeave")
                )
                .map((messageComponent) => messageComponent.create())
        );
    },

    // Handling interaction
    async execute(interaction) {},
};
