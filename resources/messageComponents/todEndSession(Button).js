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

        // Checking if player ever played any game
        if (player) {
            // Searching for Truth Or Dare session of this player
            const session = interaction.client.sessions.get(
                player.sessionIds.tod
            );

            // Checking if player is currently playing Truth or Dare
            if (session) {
                // Reading last message
                const { message } = interaction;

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
                    // Searching for Truth Or Dare session this player wants to end
                    const session = interaction.client.sessions.get(sessionId);

                    // Checking if player is answerer
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

                        // Defining new embed for initial message
                        const embeds = initialMessage.embeds.map((embed) =>
                            embed.fields.some((field) =>
                                field.name.startsWith("Players")
                            )
                                ? EmbedBuilder.from(embed)
                                      .setFields(
                                          embed.fields.with(
                                              embed.fields.findIndex((field) =>
                                                  field.name.startsWith(
                                                      "Players"
                                                  )
                                              ),
                                              {
                                                  name: "Players [0]",
                                                  value: "- none",
                                              }
                                          )
                                      )
                                      .setFooter({ text: "Game ended" })
                                : EmbedBuilder.from(embed)
                        );

                        // Checking if last message is initial message
                        if (message.id === initialMessage.id) {
                            // Defining new components for initial message
                            const components = initialMessage.components.map(
                                (actionRow) =>
                                    interaction.client.messageComponents
                                        .filter(
                                            (savedMessageComponent) =>
                                                savedMessageComponent.type ===
                                                ComponentType.ActionRow
                                        )
                                        .find((savedMessageComponent) =>
                                            savedMessageComponent.messageComponents.every(
                                                (savedButton) =>
                                                    actionRow.components
                                                        .map(
                                                            (button) =>
                                                                button.customId
                                                        )
                                                        .includes(savedButton)
                                            )
                                        )
                                        .create(interaction, {
                                            general: { disabled: true },
                                        })
                            );

                            // Updating initial message
                            await interaction.update({ components, embeds });

                            // Sending follow up message
                            interaction.followUp(
                                `${userMention(
                                    interaction.user.id
                                )} has ended this game of Truth or Dare!`
                            );
                        } else {
                            // Defining new components for last message
                            const components = message.components.map(
                                (actionRow) =>
                                    interaction.client.messageComponents
                                        .filter(
                                            (savedMessageComponent) =>
                                                savedMessageComponent.type ===
                                                ComponentType.ActionRow
                                        )
                                        .find((savedMessageComponent) =>
                                            savedMessageComponent.messageComponents.every(
                                                (savedButton) =>
                                                    actionRow.components
                                                        .map(
                                                            (button) =>
                                                                button.customId
                                                        )
                                                        .includes(savedButton)
                                            )
                                        )
                                        .create(interaction, {
                                            general: { disabled: true },
                                            todStartSession: {
                                                style: session.active
                                                    ? ButtonStyle.Success
                                                    : null,
                                            },
                                        })
                            );

                            // Editing initial message
                            initialMessage.edit({
                                embeds,
                            });

                            // Updating last message
                            await interaction.update({
                                components,
                            });

                            // Replying to interaction
                            interaction.followUp(
                                `${userMention(
                                    interaction.user.id
                                )} has ended this game of Truth or Dare!`
                            );
                        }

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
