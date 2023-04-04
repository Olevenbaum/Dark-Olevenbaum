// Importing classes and methods
const { ContextMenuCommandBuilder } = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new ContextMenuCommandBuilder().setName("").setDescription(""),
    type: 2,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {},
};
