// Importing classes and methods
const { ComponentType, RoleSelectMenuBuilder } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "(RoleSelect)",
    type: ComponentType.RoleSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new RoleSelectMenuBuilder()
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? null);
    },

    // Handling interaction
    async execute(interaction) {},
};
