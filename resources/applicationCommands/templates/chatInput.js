// Importing classes and methods
const { ApplicationCommandType, SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new SlashCommandBuilder().setDescription("").setName("").setNSFW(),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
