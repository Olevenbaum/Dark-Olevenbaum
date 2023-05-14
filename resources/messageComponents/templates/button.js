// Importing classes and methods
const { ButtonBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.Button,

    // Creating message component
    create(interaction) {
        return new ButtonBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
