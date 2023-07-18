// Importing classes and methods
const { ComponentType, ModalBuilder } = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: {},
    name: "(Modal)",

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
                                    savedMessageComponent.name.replace(
                                        /\((.*?)\)/,
                                        ""
                                    )
                                )
                        )
                        .find(
                            (savedMessageComponent) =>
                                savedMessageComponent.name.replace(
                                    /\((.*?)\)/,
                                    ""
                                ) === messageComponentName
                        )
                        .create(interaction, options)
                );
            }
        }

        // Returning action row
        return new ModalBuilder()
            .setComponents(messageComponents)
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setTitle(
                options.title ??
                    this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            );
    },

    // Handling interaction
    async execute(interaction) {},
};
