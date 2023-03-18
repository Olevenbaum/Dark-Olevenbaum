// Importing classes
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Setting command information and options
    data: new SlashCommandBuilder().setName("").setDescription(""),

    // Handling command reponse
    async execute(interaction) {},
};
