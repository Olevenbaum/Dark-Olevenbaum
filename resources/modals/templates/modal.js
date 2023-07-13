// Importing classes and methods
const { ComponentType, ModalBuilder } = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: [],
    name: "",

    // Creating modal
    create(interaction, options = {}) {
        return new ModalBuilder()
            .setComponents(
                interaction.client.messageComponents
                    .filter(
                        (messageComponent) =>
                            messageComponent.type === ComponentType.ActionRow &&
                            this.messageComponents.includes(
                                messageComponent.name
                            )
                    )
                    .map((messageComponent) =>
                        messageComponent.create(interaction, options)
                    )
            )
            .setCustomId(this.name)
            .setTitle(options.titel ?? this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
