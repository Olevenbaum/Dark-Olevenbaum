// Importing classes and methods
const {
    ComponentType,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "todCustomTruthOrDareInputField",
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction, options) {
        return new TextInputBuilder()
            .setCustomId(this.name)
            .setLabel(options.label ?? "Custom")
            .setMaxLength(options.maximalLength ?? null)
            .setMinLength(options.minimalLength ?? null)
            .setPlaceholder(
                options.setPlaceholder ?? "Insert your custom here!"
            )
            .setRequired(options.required ?? true)
            .setStyle(options.style ?? TextInputStyle.Short)
            .setValue(options.value ?? null);
    },

    // Handling interaction
    async execute(interaction) {},
};
