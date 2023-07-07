// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "todStartSession",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Start")
            .setStyle(options.style ?? ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Searching for player
        const player = interaction.client.players.get(interaction.user.id);

        // Checking if player ever played any game
        if (player) {
            // Searching for Truth or Dare session of this player
            const session = interaction.client.sessions.get(
                player.sessionIds.tod
            );

            // Checking if player is currently playing Truth or Dare
            if (session) {
                // Reading last message
                const message = interaction.message;

                // Searching embed of last message for session ID
                const sessionId = parseInt(
                    message.embeds
                        .find((embed) =>
                            embed.footer.text.startsWith("Session ID:")
                        )
                        .footer.text.replace(/^\D+/g, "")
                );

                // Checking if player is playing Truth or Dare in this session
                if (player.sessionIds.tod === sessionId) {
                    // Checking if there are enough players to start the game
                    if (session.playerIds.length <= 1) {
                        // Replying to interaction
                        interaction.reply({
                            content:
                                "There are not enough players to start a game! You need at least one more player!",
                            ephemeral: true,
                        });
                    } else {
                        // Determining questioner and answerer
                        session.answererId =
                            session.playerIds[
                                Math.floor(
                                    Math.random() * session.playerIds.length
                                )
                            ];
                        session.questionerId = session.playerIds.filter(
                            (playerId) => playerId !== session.answererId
                        )[
                            Math.floor(
                                Math.random() * (session.playerIds.length - 1)
                            )
                        ];

                        // Updating session status
                        session.active = true;

                        // Searching for initial message
                        const initialMessage = await (
                            await interaction.client.channels.fetch(
                                session.initialMessage.channelId
                            )
                        ).messages.fetch(session.initialMessage.messageId);

                        // Defining components for initial message
                        const components = initialMessage.components
                            .map((actionRow) =>
                                interaction.client.messageComponents
                                    .filter(
                                        (savedMessageComponent) =>
                                            savedMessageComponent.type ===
                                            ComponentType.ActionRow
                                    )
                                    .find((savedActionRow) =>
                                        savedActionRow.messageComponents.every(
                                            (savedButton) =>
                                                actionRow.components
                                                    .map(
                                                        (button) =>
                                                            button.customId
                                                    )
                                                    .includes(savedButton)
                                        )
                                    )
                            )
                            .map((savedActionRow) =>
                                savedActionRow.create(interaction, {
                                    general: { disabled: true },
                                    todStartSession: {
                                        style: ButtonStyle.Success,
                                    },
                                })
                            );

                        // Updating initial message
                        await interaction.update({ components });

                        // Defining components for followup message
                        components.splice(
                            0,
                            components.length,
                            ...interaction.client.messageComponents
                                .filter(
                                    (savedMessageComponent) =>
                                        savedMessageComponent.type ===
                                            ComponentType.ActionRow &&
                                        (savedMessageComponent.name ===
                                            "todChoices" ||
                                            savedMessageComponent.name ===
                                                "todManagement")
                                )
                                .map((savedActionRow) =>
                                    savedActionRow.create(interaction, {
                                        todStartSession: {
                                            disabled: true,
                                            style: session.active
                                                ? ButtonStyle.Success
                                                : null,
                                        },
                                    })
                                )
                        );

                        // Defining embed for follow up message
                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setDescription(
                                    `${userMention(
                                        session.questionerId
                                    )} says in a threatening voice: Truth or Dare, ${userMention(
                                        session.answererId
                                    )}?`
                                )
                                .setFields(),
                        ];

                        // Sending follow up message
                        interaction.followUp({ components, embeds });

                        // Updating session in client
                        interaction.client.sessions.set(sessionId, session);
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
