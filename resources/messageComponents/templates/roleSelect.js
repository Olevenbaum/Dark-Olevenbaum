// Importing classes and methods
const { ComponentType, RoleSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.RoleSelect,

    // Creating message component
    create() {
        return new RoleSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
