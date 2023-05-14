// Importing classes and methods
const { ComponentType, ButtonBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.Button,

    // Creating message component
    create() {
        return new ButtonBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
