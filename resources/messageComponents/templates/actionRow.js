// Importing classes and methods
const { ActionRowBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "",
    type: ComponentType.ActionRow,

    // Creating message component
    create(interaction) {
        return new ActionRowBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
