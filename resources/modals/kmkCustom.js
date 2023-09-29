// Importing classes and methods
const { ComponentType, EmbedBuilder, ModalBuilder } = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: { kmkCustomInput: 3 },
    name: "kmkCustom",

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
                // Defining index option for custom ID
                options.kmkCustomInputField = {};
                options.kmkCustomInputField.customIdIndex = counter;

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

        // Returning modal
        return new ModalBuilder()
            .setComponents(messageComponents)
            .setCustomId(this.name)
            .setTitle(options.title ?? this.name);
    },

    // Handling interaction
    async execute(interaction) {
        // Defining options
        const options = [];

        // Adding field values to options
        options.push(
            interaction.fields.getTextInputValue("kmkCustomInputField1").trim()
        );
        options.push(
            interaction.fields.getTextInputValue("kmkCustomInputField2").trim()
        );
        options.push(
            interaction.fields.getTextInputValue("kmkCustomInputField3").trim()
        );

        // Defining reply object
        const reply = {};

        // Checking options for duplicates
        if (
            options.map((option) => option.toLowerCase()).length ===
            new Set(options).size
        ) {
            // Defining embed for reply message
            reply.embeds = [
                new EmbedBuilder()
                    .setTitle("Kiss Marry Kill")
                    .setDescription(
                        `You have to choose between: ${options.reduce(
                            (optionsString, option, index) =>
                                (optionsString +=
                                    index === options.length - 1
                                        ? ` and ${option}`
                                        : `, ${option}`)
                        )}`
                    )
                    .setFooter({
                        text: "Options chosen among custom persons!",
                    }),
            ];

            // Defining components for reply message
            reply.components = [
                interaction.client.messageComponents
                    .filter(
                        (savedMessageComponent) =>
                            savedMessageComponent.type ===
                            ComponentType.ActionRow
                    )
                    .find(
                        (savedActionRow) =>
                            savedActionRow.name.replace(/\((.*?)\)/, "") ===
                            "kmkManagement"
                    )
                    .create(interaction),
            ];
        } else {
            // Updating reply
            reply.content = "You cannot choose one and the same person twice!";
            reply.ephemeral = true;
        }

        // Replying to interaction
        interaction.reply(reply);
    },
};
