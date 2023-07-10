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
            .setMaxLength(options.maximalLength)
            .setMinLength(options.minimalLength)
            .setPlaceholder(options.setPlaceholder)
            .setRequired(options.required)
            .setStyle(options.style ?? TextInputStyle.Short)
            .setValue(options.value);
    },

    // Handling interaction
    async execute(interaction) {},
};
