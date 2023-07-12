// Importing classes and methods
const {
    ComponentType,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkCustomCelebritiesInputField3",
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction, options) {
        return new TextInputBuilder()
            .setCustomId(this.name)
            .setLabel(options.label ?? "Third Person")
            .setMinLength(options.minimalLength ?? 1)
            .setPlaceholder(options.setPlaceholder ?? "Third Person")
            .setRequired(options.required ?? true)
            .setStyle(options.style ?? TextInputStyle.Short);
    },

    // Handling interaction
    async execute(interaction) {},
};
