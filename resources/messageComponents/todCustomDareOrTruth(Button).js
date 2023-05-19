// Importing classes and methods
const { ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todCustomDareOrTruth",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Custom")
            .setStyle(options.style ?? ButtonStyle);
    },

    // Handling interaction
    async execute(interaction) {},
};
