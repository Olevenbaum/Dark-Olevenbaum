// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkShowPictures",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Show Pictures")
            .setStyle(options.style ?? ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Reading subcommand
        const subcommand = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .footer.text.includes("celebrities")
            ? "Celebrites"
            : "FictionalCharacters";

        // Importing data
        const data = require(`../../database/constantData/kmk${subcommand}`);

        // Reading options
        const options = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .description.replace("You have to choose between: ", "")
            .replace(" and", ",")
            .split(", ")
            .map((option) => data.find((entry) => entry.name === option));

        // Replying to interaction
        interaction.reply({
            content: `${options
                .map((option) => option.name + "\n" + option.picture)
                .join("\n")}`,
            ephemeral: true,
        });
    },
};
