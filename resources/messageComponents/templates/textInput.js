// Importing classes and methods
const { ComponentType, TextInputBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.TextInput,

    // Creating message component
    create() {
        return new TextInputBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
