// Importing classes and methods
const { ComponentType, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name, options and type
    name: "(StringSelect)",
    options: [],
    type: ComponentType.StringSelect,

    // Creating message component
    create(interaction, options) {
        return new StringSelectMenuBuilder()
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setDisabled(options.disabled ?? false)
            .setMaxValues(
                options.maximalValues ??
                    options.options.length ??
                    this.options.length
            )
            .setMinValues(options.minimalValues ?? 1)
            .setOptions(options.options ?? this.options)
            .setPlaceholder(options.placeholder ?? null);
    },

    // Handling interaction
    async execute(interaction) {},
};
