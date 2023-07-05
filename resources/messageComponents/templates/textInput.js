// Importing classes and methods
const { ComponentType, TextInputBuilder } = require("discord.js");

module.exports = {
    // Setting message components type and name
    name: "",
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction, options) {
        return new TextInputBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
