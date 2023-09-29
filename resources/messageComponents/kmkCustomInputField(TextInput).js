// Importing classes and methods
const {
    ComponentType,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: `kmkCustomInputField(${this.type})`,
    type: ComponentType.TextInput,

    // Creating message component
    create(interaction, options) {
        return new TextInputBuilder()
            .setCustomId(
                this.name.replace(/\((.*?)\)/, options.customIdIndex ?? "")
            )
            .setLabel(
                options.label ??
                    `${
                        options.customIdIndex === 0
                            ? "First"
                            : options.customIdIndex === 1
                            ? "Second"
                            : "Third"
                    } Person`
            )
            .setMinLength(options.minimalLength ?? 1)
            .setPlaceholder(
                options.setPlaceholder ??
                    `${
                        options.customIdIndex === 0
                            ? "First"
                            : options.customIdIndex === 1
                            ? "Second"
                            : "Third"
                    } Person`
            )
            .setRequired(options.required ?? true)
            .setStyle(options.style ?? TextInputStyle.Short);
    },

    // Handling interaction
    async execute(interaction) {},
};
