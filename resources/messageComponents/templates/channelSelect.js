// Importing classes and methods
const { ChannelSelectMenuBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.ChannelSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new ChannelSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled)
            .setMaxValues(options.maximalValues ?? options.options.length)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder)
            .setChannelTypes(options.channelTypes);
    },

    // Handling interaction
    async execute(interaction) {},
};
