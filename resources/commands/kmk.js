// Importing classes and methods
const { ApplicationCommandType, SlashCommandBuilder } = require("discord.js");

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
                .addChoices({ name: "Server", value: "server" })
                .setRequired(true)
        ),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
