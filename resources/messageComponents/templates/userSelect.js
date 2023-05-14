// Importing classes and methods
const { ComponentType, UserSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.UserSelect,

    // Creating message component
    create() {
        return new UserSelectMenuBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
