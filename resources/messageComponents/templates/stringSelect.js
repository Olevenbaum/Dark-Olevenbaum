// Importing classes and methods
const { ComponentType, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "",
    type: ComponentType.StringSelect,

    // Creating message component
    create(interaction, options) {
        return new StringSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
