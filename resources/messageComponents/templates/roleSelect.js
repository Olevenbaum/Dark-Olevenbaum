// Importing classes and methods
const { ComponentType, RoleSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.RoleSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new RoleSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
