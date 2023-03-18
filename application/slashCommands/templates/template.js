// Importing classes
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Setting command information and options
    data: new SlashCommandBuilder().setName("").setDescription(""),
    // Handling command autocomplete
    async autocomplete(interaction) {},
    // Handling command reponse
    async execute(interaction) {},
};
