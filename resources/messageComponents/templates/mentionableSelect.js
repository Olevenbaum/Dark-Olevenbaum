// Importing classes and methods
const { ComponentType, MentionableSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.MentionableSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new MentionableSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? null);
    },

    // Handling interaction
    async execute(interaction) {},
};
