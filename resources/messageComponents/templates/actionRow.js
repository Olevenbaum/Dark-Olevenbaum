// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components components, name and type
    messageComponents: {},
    name: `(${this.type})`,
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction, options = {}) {
        // Creating empty array for message components
        const messageComponents = [];

        // Iterating over message components
        for (const [messageComponentName, option] in Object.entries(
            this.messageComponents
        )) {
            // Creating counter
            counter = typeof option === "number" ? option : option.length;

            // Iterating over counter of message component
            for (let index = 0; index < counter; index++) {
                // Checking number of message components
                if (counter > 1) {
                    // Defining index option for custom ID
                    options[messageComponentName].customIdIndex = index;
                    // Checking if option or counter was given
                    if (typeof option !== "number") {
                        // Adding options
                        options[messageComponentName] = {
                            ...options[messageComponentName],
                            ...option,
                        };
                    }
                }

                // Adding message component
                messageComponents.push(
                    interaction.client.messageComponents
                        .filter(
                            (savedMessageComponent) =>
                                savedMessageComponent.type === ComponentType &&
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
};
