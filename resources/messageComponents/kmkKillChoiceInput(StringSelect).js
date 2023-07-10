// Importing classes and methods
const { ComponentType, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name, options and type
    name: "kmkKillChoiceInput",
    options: [],
    type: ComponentType.StringSelect,

    // Creating message component
    create(interaction, options) {
        return new StringSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled)
            .setMaxValues(options.maximalValues ?? 1)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder)
            .addOptions(options.options);
    },

    // Handling interaction
    async execute(interaction) {},
};
