// Importing classes and methods
const {
    ApplicationCommandType,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new SlashCommandBuilder()
        .setName("tod")
        .setDescription("Starts a new Truth or Dare game")
        .addIntegerOption((option) =>
            option
                .setName("skips")
                .setDescription(
                    "The number of skips everyone should have in this session"
                )
        )
        .addIntegerOption((option) =>
            option
                .setName("rating")
                .setDescription("The level of spice you want to play with")
                .addChoices(
                    { name: "0+", value: 0 },
                    { name: "12+", value: 12 },
                    { name: "16+", value: 16 },
                    { name: "18+", value: 18 }
                )
        ),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {
        // Searching for player or creating new one
        const [player] =
            await interaction.client.sequelize.models.player.findOrCreate({
                default: { id: interaction.user.id },
                where: { id: interaction.user.id },
            });

        // Checking if player already joined another session
        if (await player.getSession()) {
            interaction.reply({
                content:
                    "You already joined another game of Truth or Dare, finish your current game to start another!",
                ephemeral: true,
            });
        } else {
            // Reading options values
            const rating = interaction.options.getInteger("rating") ?? 0;
            const skips = interaction.options.getInteger("skips") ?? 0;

            // Creating new session
            const session = await player.createSession({
                rating,
                skips,
            });

            // Defining reply message content
            const components = interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.ActionRow &&
                        (messageComponent.name === "joinOrStart" ||
                            messageComponent.name === "endOrLeave")
                )
                .map((messageComponent) =>
                    messageComponent.create(interaction)
                );

            const embeds = [
                new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Truth or Dare")
                    .setDescription(
                        `${userMention(
                            interaction.guild.roles.everyone.id
                        )} gather round for an epic round of Truth or Dare!`
                    )
                    .setFields(
                        {
                            name: "Players [1]:",
                            value: userMention(interaction.user.id),
                        },
                        {
                            inline: true,
                            name: "Rating:",
                            value: `${session.rating}+`,
                        },
                        {
                            inline: true,
                            name: "Skips:",
                            value: `${session.skips}`,
                        }
                    )
                    .setFooter({ text: `Session ID: ${session.id}` }),
            ];

            // Replying to interaction
            interaction.reply({ components, embeds });
        }
    },
};
