// Importing classes and methods
const { ComponentType, TextInputBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction) {
        return new TextInputBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
