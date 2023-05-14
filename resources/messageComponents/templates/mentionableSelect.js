// Importing classes and methods
const { ComponentType, MentionableSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.MentionableSelect,

    // Creating message component
    create() {
        return new MentionableSelectMenuBuilder();
    },

    // Handling interaction
    async execute(interaction) {},
};
