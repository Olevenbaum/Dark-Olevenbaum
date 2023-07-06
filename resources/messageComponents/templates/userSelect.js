// Importing classes and methods
const { ComponentType, UserSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.UserSelect,

    // Creating message component
    create(interaction, options) {
        return new UserSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
