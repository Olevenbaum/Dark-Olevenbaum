// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todStart",
    type: ComponentType.Button,

    // Creating message component
    create(interaction) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel("Start")
            .setStyle(ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Searching for player
        const player = await interaction.client.sequelize.models.player.findOne(
            {
                where: { id: interaction.user.id },
            }
        );

        // Checking if user ever played Truth or Dare
        if (player) {
            // Searching for session of this player
            const session = await player.getSession();

            // Checking if user is currently playing Truth or Dare
            if (session) {
                // Reading message data
                const message = interaction.message;

                // Reading old embed
                const oldEmbed = message.embeds.find((embed) =>
                    embed.fields.some((field) =>
                        field.name.startsWith("Players")
                    )
                );

                // Searching embed for session ID
                const sessionId = parseInt(
                    oldEmbed.footer.text.replace(/^\D+/g, "")
                );

                // Checking if user is playing Truth or Dare in this session
                if (session.id === sessionId) {
                    const players = await session.getPlayers();

                    // Checking if session already started
                    if (session.active) {
                        // Replying to interaction
                        interaction.reply({
                            content: "This game already was started!",
                            ephemeral: true,
                        });
                    } else {
                        // Checking if there are enough players to start a game
                        if (players.length <= 1) {
                            // Replying to interaction
                            interaction.reply({
                                content:
                                    "There are not enough players to start a game! You need at least one more player!",
                                ephemeral: true,
                            });
                        } else {
                            // Determining questioner and answerer
                            let questioner =
                                players[
                                    Math.floor(Math.random() * players.length)
                                ];
                            let answerer = players.filter(
                                (player) => player.id !== questioner.id
                            )[Math.floor(Math.random() * (players.length - 1))];
                            await Promise.all([
                                session.setQuestioner(questioner),
                                session.setAnswerer(answerer),
                                // Activating session
                                session.update({ active: true }),
                            ]);

                            // Editing old message
                            let components = message.components;
                            const startButton = ButtonBuilder()
                                .from(
                                    components
                                        .filter(
                                            (component) =>
                                                component.type ===
                                                ComponentType.ActionRow
                                        )[1]
                                        .components.filter(
                                            (component) =>
                                                component.type ===
                                                    ComponentType.Button &&
                                                component.custom_id ===
                                                    "todStart"
                                        )
                                )
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true);

                            message.edit({ components: [] });

                            // Defining reply message content
                            components =
                                interaction.client.messageComponents.filter(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        (messageComponent.name === "tod" ||
                                            messageComponent.name === "tod")
                                );

                            const embeds = [
                                new EmbedBuilder()
                                    .setColor(0x0099ff)
                                    .setTitle("Truth or Dare")
                                    .setDescription(
                                        `${userMention(
                                            questioner.id
                                        )} says in a threatening voice: Truth or Dare, ${userMention(
                                            answerer.id
                                        )}?`
                                    )
                                    .setFooter({
                                        text: `Session ID: ${session.id}`,
                                    }),
                            ];

                            // Replying to interaction
                            interaction.reply({ components, embeds });
                        }
                    }
                } else {
                    // Replying to interaction
                    interaction.reply({
                        content:
                            "This button does not belong to your current game!",
                        ephemeral: true,
                    });
                }
            } else {
                // Replying to interaction
                interaction.reply({
                    content:
                        "You cannot start this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            }
        } else {
            // Replying to interaction
            interaction.reply({
                content:
                    "You cannot start this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        }
    },
};
