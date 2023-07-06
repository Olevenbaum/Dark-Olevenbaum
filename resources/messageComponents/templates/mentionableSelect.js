// Importing classes and methods
const { ComponentType, MentionableSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.MentionableSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new MentionableSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
