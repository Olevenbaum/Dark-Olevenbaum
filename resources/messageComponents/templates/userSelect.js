// Importing classes and methods
const { ComponentType, UserSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "",
    type: ComponentType.UserSelect,

    // Creating message component
    create(interaction) {
        return new UserSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
