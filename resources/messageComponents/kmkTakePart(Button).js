// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkTakePart",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Take Part")
            .setStyle(options.style ?? ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Reading options
        const options = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .description.replace("You have to choose between: ", "")
            .replace(" and", ",")
            .split(", ");

        // Reading subcommand
        const subcommand = interaction.message.embeds
            .find((embed) => embed.title === "Kiss Marry Kill")
            .footer.text.includes("server")
            ? "server"
            : "celebrities";

        // Checking subcommand
        if (subcommand === "server") {
            // Fetching members from Discord
            options.splice(
                0,
                options.length,
                ...(await Promise.all(
                    options.map(
                        async (option) =>
                            await interaction.guild.members.fetch(
                                option.replace(/[^0-9]/g, "")
                            )
                    )
                ))
            );

            // Defining string select options
            options.splice(
                0,
                options.length,
                ...options.map((option) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(option.nickname)
                        .setValue(option.id)
                )
            );
        } else {
            // Defining string select options
            options.splice(
                0,
                options.length,
                ...options.map((option) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(option)
                        .setValue(option)
                )
            );
        }

        // Defining reply message components
        const components = interaction.client.messageComponents
            .filter(
                (savedMessageComponent) =>
                    savedMessageComponent.type === ComponentType.ActionRow &&
                    (savedMessageComponent.name === "kmkKillChoice" ||
                        savedMessageComponent.name === "kmkKissChoice" ||
                        savedMessageComponent.name === "kmkMarryChoice")
            )
            .map((savedActionRow) =>
                savedActionRow.create(interaction, {
                    general: { options: options },
                })
            );

        // Replying to interaction
        interaction.reply({
            components,
            ephemeral: true,
        });
    },
};
