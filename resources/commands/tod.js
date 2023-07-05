// Importing classes and methods
const {
    ApplicationCommandType,
    ComponentType,
    EmbedBuilder,
    roleMention,
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
                .setMinValue(0)
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
        if (!interaction.client.players.has(interaction.user.id)) {
            interaction.client.players.set(interaction.user.id, {
                sessionIds: {},
                todSkips: null,
            });
        }
        const player = interaction.client.players.get(interaction.user.id);

        // Checking if player already joined another session of Truth or Dare
        if (player.sessionIds.tod) {
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
            const session = {
                active: false,
                answererId: null,
                confirmed: null,
                initialMessage: {
                    channelId: interaction.channelId,
                    messageId: null,
                },
                kind: "tod",
                playerIds: [interaction.user.id],
                questionerId: null,
                rating,
                skips,
            };

            // Finding session ID by searching for first number not being used
            const sessionId =
                interaction.client.sessions
                    .map((session, sessionId) => sessionId)
                    .sort((a, b) => a - b)
                    .map((number, index) => (number === index ? null : index))
                    .find((index) => index) ?? interaction.client.sessions.size;

            // Updating player
            player.sessionIds.tod = sessionId;
            player.todSkips = skips;

            // Defining reply message components
            const components = interaction.client.messageComponents
                .filter(
                    (messageComponent) =>
                        messageComponent.type === ComponentType.ActionRow &&
                        messageComponent.name === "todManagement"
                )
                .map((messageComponent) =>
                    messageComponent.create(interaction)
                );

            // Defining reply message embed
            const embeds = [
                new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Truth or Dare")
                    .setDescription(
                        `${roleMention(
                            interaction.guild.roles.everyone.id
                        )} gather round for an epic round of Truth or Dare!`
                    )
                    .setFields(
                        {
                            name: "Players [1]:",
                            value: `- ${userMention(interaction.user.id)}`,
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
                    .setFooter({ text: `Session ID: ${sessionId}` }),
            ];

            // Replying to interaction
            await interaction.reply({ components, embeds });

            // Updating initial message of session
            session.initialMessage.messageId = (
                await interaction.fetchReply()
            ).id;

            // Updating player and session in client
            interaction.client.sessions.set(sessionId, session);
            interaction.client.players.set(interaction.user.id, player);
        }
    },
};
