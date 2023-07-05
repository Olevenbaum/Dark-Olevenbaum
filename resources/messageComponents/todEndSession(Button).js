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
    name: "todEndSession",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "End")
            .setStyle(options.style ?? ButtonStyle.Danger);
    },

    // Handling interaction
    async execute(interaction) {
        // Searching for player
        const player = interaction.client.players.get(interaction.user.id);

        // Checking if user ever played any game
        if (player) {
            // Searching for Truth Or Dare session of this player
            const session = interaction.client.sessions.get(
                player.sessionIds.tod
            );

            // Checking if user is currently playing Truth or Dare
            if (session) {
                // Reading old message
                const message = interaction.message;

                // Searching embed for session ID
                const sessionId = parseInt(
                    message.embeds
                        .find((embed) =>
                            embed.footer.text.startsWith("Session ID:")
                        )
                        .footer.text.replace(/^\D+/g, "")
                );

                // Checking if user is playing Truth or Dare in this session
                if (player.sessionIds.tod === sessionId) {
                    // Searching for Truth Or Dare this player wants to end
                    const session = interaction.client.sessions.get(sessionId);

                    // Checking if player has to answer a question at the moment
                    if (
                        session.active &&
                        interaction.user.id === session.answererId &&
                        session.playerIds.length > 1
                    ) {
                        // Replying to interaction
                        interaction.reply({
                            content: `Coward, do not run from your responsibilities! Stay in this game and answer your question from ${userMention(
                                session.questionerId
                            )} before leaving!`,
                            ephemeral: true,
                        });
                    } else {
                        // Removing skips from players and players from session
                        session.playerIds.forEach((playerId) => {
                            const player =
                                interaction.client.players.get(playerId);
                            player.sessionIds.tod = null;
                            player.todSkips = null;
                            interaction.client.players.set(playerId, player);
                        });

                        // Searching for initial message
                        const initialMessage = await (
                            await interaction.client.channels.fetch(
                                session.initialMessage.channelId
                            )
                        ).messages.fetch(session.initialMessage.messageId);

                        // Reading old embed of initial message
                        const initialEmbed = initialMessage.embeds.find(
                            (embed) =>
                                embed.fields.some((field) =>
                                    field.name.startsWith("Players")
                                )
                        );

                        // Defining new embed for initial message
                        initialEmbed.fields.splice(
                            initialEmbed.fields.findIndex((field) =>
                                field.name.startsWith("Players")
                            ),
                            1,
                            {
                                name: "Players [0]",
                                value: "- none -",
                            }
                        );
                        const embeds = [
                            EmbedBuilder.from(initialEmbed)
                                .setFields(initialEmbed.fields)
                                .setFooter({ text: "Game ended" }),
                        ];

                        // Defining new components for initial message
                        const components = initialMessage.components.map(
                            (oldMessageComponent) =>
                                interaction.client.messageComponents
                                    .find(
                                        (messageComponent) =>
                                            messageComponent.type ===
                                                ComponentType.ActionRow &&
                                            messageComponent.messageComponents.every(
                                                (messageComponent) =>
                                                    oldMessageComponent.components
                                                        .map(
                                                            (
                                                                messageComponent
                                                            ) =>
                                                                messageComponent.customId
                                                        )
                                                        .includes(
                                                            messageComponent
                                                        )
                                            )
                                    )
                                    .create(interaction, {
                                        general: { disabled: true },
                                    })
                        );

                        // Editing initial message
                        initialMessage.edit({
                            components,
                            embeds,
                        });

                        // Checking if last message is initial message
                        if (initialMessage.id !== message.id) {
                            // Defining new components for last message
                            components.splice(
                                0,
                                components.length,
                                initialMessage.components.map(
                                    (oldMessageComponent) =>
                                        interaction.client.messageComponents
                                            .find(
                                                (messageComponent) =>
                                                    messageComponent.type ===
                                                        ComponentType.ActionRow &&
                                                    messageComponent.messageComponents.every(
                                                        (messageComponent) =>
                                                            oldMessageComponent.components
                                                                .map(
                                                                    (
                                                                        messageComponent
                                                                    ) =>
                                                                        messageComponent.customId
                                                                )
                                                                .includes(
                                                                    messageComponent
                                                                )
                                                    )
                                            )
                                            .create(interaction, {
                                                general: { disabled: true },
                                            })
                                )
                            );

                            // Editing last message
                            message.edit({ components });
                        }

                        // Replying to interaction
                        interaction.reply(
                            `${userMention(
                                interaction.user.id
                            )} has ended this game of Truth or Dare!`
                        );

                        // Deleting session
                        interaction.client.sessions.delete(sessionId);
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
                        "You cannot end this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            }
        } else {
            // Replying to interaction
            interaction.reply({
                content:
                    "You cannot end this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        }
    },
};
