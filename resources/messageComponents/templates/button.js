// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled)
            .setEmoji(options.emoji)
            .setLabel(options.label ?? this.name)
            .setStyle(options.style ?? ButtonStyle)
            .setURL(options.url);
    },

    // Handling interaction
    async execute(interaction) {},
};
