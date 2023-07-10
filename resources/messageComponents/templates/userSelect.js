// Importing classes and methods
const { ComponentType, UserSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.UserSelect,

    // Creating message component
    create(interaction, options) {
        return new UserSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled)
            .setMaxValues(options.maximalValues ?? options.options.length)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder);
    },

    // Handling interaction
    async execute(interaction) {},
};
