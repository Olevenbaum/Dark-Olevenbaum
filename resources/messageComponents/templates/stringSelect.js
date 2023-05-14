// Importing classes and methods
const { ComponentType, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.StringSelect,

    // Creating message component
    create() {
        return new StringSelectMenuBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
