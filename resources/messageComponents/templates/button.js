// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "(Button)",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setDisabled(options.disabled ?? false)
            .setLabel(
                options.label ??
                    this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setStyle(options.style ?? ButtonStyle);
    },

    // Handling interaction
    async execute(interaction) {},
};
