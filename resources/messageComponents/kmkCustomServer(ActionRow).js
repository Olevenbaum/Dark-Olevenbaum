// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components components, name and type
    messageComponents: { kmkCustomServerInputField: 1 },
    name: `kmkCustomServer(${this.type})`,
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        // Creating empty array for message components
        const messageComponents = [];

        // Iterating over message components
        for (const [messageComponentName, number] in Object.entries(
            this.messageComponents
        )) {
            // Iteracting over counter of message component
            for (let counter = 0; counter < number; counter++) {
                // Checking counter of message component
                if (counter > 1) {
                    // Defining index option for custom ID
                    options[messageComponentName].customIdIndex = counter;
                }

                // Adding message component
                messageComponents.push(
                    interaction.client.messageComponents
                        .filter(
                            (savedMessageComponent) =>
                                savedMessageComponent.type ===
                                    ComponentType.TextInput &&
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
                        .create(interaction, {
                            ...options.general,
                            ...options[messageComponentName],
                        })
                );
            }
        }

        // Returning action row
        return new ActionRowBuilder().setComponents(messageComponents);
    },

    // Handling interaction
    async execute(interaction) {},
};
