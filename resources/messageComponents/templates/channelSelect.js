// Importing classes and methods
const { ChannelSelectMenuBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "(ChannelSelect)",
    type: ComponentType.ChannelSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new ChannelSelectMenuBuilder()
            .setChannelTypes(options.channelTypes ?? null)
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? null)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(
                options.placeholder ??
                    this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            );
    },

    // Handling interaction
    async execute(interaction) {},
};
