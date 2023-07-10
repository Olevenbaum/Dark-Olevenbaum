// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkTakePart",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled)
            .setEmoji(options.emoji)
            .setLabel(options.label ?? "Take Part")
            .setStyle(options.style ?? ButtonStyle.Primary)
            .setURL(options.url);
    },

    // Handling interaction
    async execute(interaction) {
        // Defining reply message components
        const components = interaction.client.messageComponents
            .filter(
                (savedMessageComponent) =>
                    savedMessageComponent.type === ComponentType.ActionRow &&
                    (savedMessageComponent.name === "kmkKillChoice" ||
                        savedMessageComponent.name === "kmkKissChoice" ||
                        savedMessageComponent.name === "kmkMarryChoice")
            )
            .map((savedactionRow) => savedactionRow.create(interaction, {}));

        // Replying to interaction
        interaction.reply({
            components,
            ephemeral: true,
        });
    },
};
