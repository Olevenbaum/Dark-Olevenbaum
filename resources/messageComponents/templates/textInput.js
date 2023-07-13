// Importing classes and methods
const {
    ComponentType,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "",
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction, options) {
        return new TextInputBuilder()
            .setCustomId(this.name)
            .setLabel(options.label ?? this.name)
            .setMaxLength(options.maximalLength ?? null)
            .setMinLength(options.minimalLength ?? 1)
            .setPlaceholder(options.setPlaceholder ?? null)
            .setRequired(options.required ?? false)
            .setStyle(options.style ?? TextInputStyle)
            .setValue(options.value ?? null);
    },

    // Handling interaction
    async execute(interaction) {},
};
