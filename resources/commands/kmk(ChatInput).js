// Importing classes and methods
const {
    ApplicationCommandType,
    SlashCommandBuilder,
    ComponentType,
} = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new SlashCommandBuilder()
        .setName("kmk")
        .setDescription("Starts a new game of Kiss Marry Kill")
        .addStringOption((option) =>
            option
                .setName("kind")
                .setDescription(
                    "Specifies the kind of persons you want to play with"
                )
                .addChoices(
                    { name: "Celebrities", value: "celebrities" },
                    { name: "Custom", value: "custom" },
                    { name: "Server", value: "server" }
                )
                .setRequired(true)
        ),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {
        const components = interaction.client.messageComponents
            .filter(
                (savedMessageComponent) =>
                    savedMessageComponent.type === ComponentType.ActionRow
            )
            .map((savedActionRow) => savedActionRow.create(interaction));

        components.splice(0, 0, null);

        console.log(components);

        interaction.reply({ content: "Test", components });
    },
};
