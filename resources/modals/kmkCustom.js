// Importing classes and methods
const { ComponentType, EmbedBuilder, ModalBuilder } = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: [
        "kmkCustomInput1",
        "kmkCustomInput2",
        "kmkCustomInput3",
    ],
    name: "kmkCustom",

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
    async execute(interaction) {
        console.log(interaction.message);
        // Reading subcommand
        const subcommand = interaction.fields.getField("kmkCustomInputField1");

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
                            savedActionRow.name === "kmkManagement"
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
