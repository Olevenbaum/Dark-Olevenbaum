// Importing classes and methods
const { ComponentType, ModalBuilder } = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: {},
    name: "",

    // Creating modal
    create(interaction, options = {}) {
        // Creating empty array for message components
        const messageComponents = [];

        // Iterating over message components
        for (const [messageComponentName, number] in Object.entries(
            this.messageComponents
        )) {
            // Iteracting over counter of message component
            for (let counter = 0; counter < number; counter++) {
                // Adding message component
                messageComponents.push(
                    interaction.client.messageComponents
                        .filter(
                            (savedMessageComponent) =>
                                savedMessageComponent.type ===
                                    ComponentType.ActionRow &&
                                this.messageComponents.hasOwn(
                                    savedMessageComponent.name
                                )
                        )
                        .find(
                            (savedMessageComponent) =>
                                savedMessageComponent.name ===
                                messageComponentName
                        )
                        .create(interaction, options)
                );
            }
        }

        // Returning action row
        return new ActionRowBuilder().setComponents(messageComponents);
    },

    // Handling interaction
    async execute(interaction) {},
};
