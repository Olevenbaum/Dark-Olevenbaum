// Importing classes and methods
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new SlashCommandBuilder().setName("").setDescription(""),
    type: 1,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
