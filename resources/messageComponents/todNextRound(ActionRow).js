// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components components, name and type
    messageComponents: ["todConfirm", "todSkip"],
    name: "todNextRound",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        return new ActionRowBuilder().addComponents(
            interaction.client.messageComponents
                .filter(
                    (savedMessageComponent) =>
                        savedMessageComponent.type === ComponentType.Button &&
                        this.messageComponents.includes(
                            savedMessageComponent.name
                        )
                )
                .map((savedMessageComponent) =>
                    savedMessageComponent.create(interaction, {
                        ...options.general,
                        ...options[savedMessageComponent.name],
                    })
                )
        );
    },

    // Handling interaction
    async execute(interaction) {},
};
