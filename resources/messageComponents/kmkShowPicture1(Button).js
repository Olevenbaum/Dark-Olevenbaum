// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkShowPicture1",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Show Picture")
            .setStyle(options.style ?? ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Reading subcommand
        const subcommand = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .footer.text.includes("celebrities")
            ? "Celebrities"
            : "FictionalCharacters";

        // Importing data
        const data = require(`../../database/constantData/kmk${subcommand}.json`);

        // Reading option
        const option = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .description.replace("You have to choose between: ", "")
            .replace(" and", ",")
            .split(", ")
            .map((option) => data.find((entry) => entry.name === option))
            .at(parseInt(this.name.replace(/[^0-9]/g, "") - 1));

        // Replying to interaction
        interaction.reply({
            content: `${option.name}:\n${option.picture}`,
            ephemeral: true,
        });
    },
};
