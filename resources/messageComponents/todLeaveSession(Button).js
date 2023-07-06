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
    name: "todLeaveSession",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Leave")
            .setStyle(options.style ?? ButtonStyle.Danger);
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
                    // Checking if player is answerer or questioner
                    if (
                        session.active &&
                        session.answererId === interaction.user.id
                    ) {
                        // Replying to interaction
                        interaction.reply({
                            content: `Coward, do not run from your responsibilities! Stay in this game and answer your question from ${userMention(
                                session.questionerId
                            )} before leaving!`,
                            ephemeral: true,
                        });
                    } else if (
                        session.active &&
                        session.questionerId === interaction.user.id
                    ) {
                        // Replying to interaction
                        interaction.reply({
                            content: `You have to ask ${userMention(
                                session.answererId
                            )} a question before leaving!`,
                            ephemeral: true,
                        });
                    } else {
                        // Removing skips from player and player from session
                        player.todSkips = null;
                        player.sessionIds.tod = null;
                        session.playerIds.splice(
                            session.playerIds.indexOf(interaction.user.id),
                            1
                        );

                        // Searching for initial message
                        const initialMessage = await (
                            await interaction.client.channels.fetch(
                                session.initialMessage.channelId
                            )
                        ).messages.fetch(session.initialMessage.messageId);

                        // Defining new embed for initial message
                        let playersString = "";
                        session.playerIds.forEach(
                            (playerId) =>
                                (playersString += `\n- ${userMention(
                                    playerId
                                )}`)
                        );
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
                                                  value:
                                                      session.playerIds
                                                          .length === 0
                                                          ? "- none"
                                                          : playersString,
                                              }
                                          )
                                      )
                                      .setFooter({
                                          text:
                                              session.playerIds.length === 0
                                                  ? "Game ended"
                                                  : embed.footer.text,
                                      })
                                : EmbedBuilder.from(embed)
                        );

                        // Reading components of initial message
                        const { components } = initialMessage;

                        // Checking if last message is initial message
                        if (message.id === initialMessage.id) {
                            // Checking if there are enough players left for playing
                            if (session.playerIds.length === 0) {
                                // Defining new components for initial message
                                components.splice(
                                    0,
                                    components.length,
                                    ...components.map((actionRow) =>
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
                                                            .includes(
                                                                savedButton
                                                            )
                                                )
                                            )
                                            .create(interaction, {
                                                general: { disabled: true },
                                            })
                                    )
                                );
                            }

                            // Updating initial message
                            await interaction.update({ components, embeds });

                            // Sending follow up message
                            interaction.followUp(
                                `${userMention(
                                    interaction.user.id
                                )} has left the game${
                                    session.playerIds.length === 0
                                        ? " and thereby ended it"
                                        : ""
                                }!`
                            );
                        } else {
                            // Checking if there are enough players left for playing
                            if (session.playerIds.length === 0) {
                                // Defining new components for last message
                                components.splice(
                                    0,
                                    components.length,
                                    ...message.components.map((actionRow) =>
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
                                                            .includes(
                                                                savedButton
                                                            )
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
                                    )
                                );

                                // Updating last message
                                await interaction.update({
                                    components,
                                });

                                // Sending follow up message
                                interaction.followUp(
                                    `${userMention(
                                        interaction.user.id
                                    )} has left the game${
                                        session.playerIds.length === 0
                                            ? " and thereby ended it"
                                            : ""
                                    }!`
                                );
                            } else {
                                interaction.reply(
                                    `${userMention(
                                        interaction.user.id
                                    )} has left the game${
                                        session.playerIds.length === 0
                                            ? " and thereby ended it"
                                            : ""
                                    }!`
                                );
                            }

                            // Editing initial message
                            initialMessage.edit({
                                embeds,
                            });
                        }

                        // Checking if there are enough players left
                        if (session.playerIds.length === 0) {
                            // Deleting session
                            interaction.client.sessions.delete(sessionId);
                        } else {
                            // Updating session in client
                            interaction.client.sessions.set(sessionId, session);
                        }

                        // Updating player in client
                        interaction.client.players.set(
                            interaction.user.id,
                            player
                        );
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
                        "You cannot leave this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            }
        } else {
            // Replying to interaction
            interaction.reply({
                content:
                    "You cannot leave this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        }
    },
};
