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
    name: "todSkip",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Skip")
            .setStyle(options.style ?? ButtonStyle.Secondary);
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
                    // Checking if player is answerer
                    if (interaction.user.id === session.answererId) {
                        if (player.todSkips === 0) {
                            // Replying to interaction
                            interaction.reply({
                                content: "You do not have any skips left!",
                                ephemeral: true,
                            });
                        } else {
                            // Reading Truth or Dare from embed of last message
                            const tod = message.embeds
                                .find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                                .title.replace("Custom ", "")
                                .replace("Random ", "");

                            // Reading number of already used random Truths or Dares
                            const randomCounter = parseInt(
                                message.components
                                    .find((actionRow) =>
                                        interaction.client.messageComponents
                                            .filter(
                                                (savedMessageComponent) =>
                                                    savedMessageComponent.type ===
                                                    ComponentType.ActionRow
                                            )
                                            .find(
                                                (savedActionRow) =>
                                                    savedActionRow.name ===
                                                    "todCustomOrRandom"
                                            )
                                            .messageComponents.every(
                                                (savedButton) =>
                                                    actionRow.components
                                                        .map(
                                                            (button) =>
                                                                button.customId
                                                        )
                                                        .includes(savedButton)
                                            )
                                    )
                                    .components.find(
                                        (button) =>
                                            button.customId ===
                                            "todRandomTruthOrDare"
                                    )
                                    .label.replace(/^\D+/g, "")
                                    .charAt(0)
                            );

                            // Reading style of custom Truth or Dare button
                            const style = message.components
                                .find((actionRow) =>
                                    interaction.client.messageComponents
                                        .filter(
                                            (savedMessageComponent) =>
                                                savedMessageComponent.type ===
                                                ComponentType.ActionRow
                                        )
                                        .find(
                                            (savedActionRow) =>
                                                savedActionRow.name ===
                                                "todCustomOrRandom"
                                        )
                                        .messageComponents.every(
                                            (savedButton) =>
                                                actionRow.components
                                                    .map(
                                                        (button) =>
                                                            button.customId
                                                    )
                                                    .includes(savedButton)
                                        )
                                )
                                .components.find(
                                    (button) =>
                                        button.customId ===
                                        "todCustomTruthOrDare"
                                ).style;

                            // Reading number of confirms
                            const confirmedCounter = parseInt(
                                message.components
                                    .find((actionRow) =>
                                        interaction.client.messageComponents
                                            .filter(
                                                (savedMessageComponent) =>
                                                    savedMessageComponent.type ===
                                                    ComponentType.ActionRow
                                            )
                                            .find(
                                                (savedActionRow) =>
                                                    savedActionRow.name ===
                                                    "todNextRound"
                                            )
                                            .messageComponents.every(
                                                (savedButton) =>
                                                    actionRow.components
                                                        .map(
                                                            (button) =>
                                                                button.customId
                                                        )
                                                        .includes(savedButton)
                                            )
                                    )
                                    .components.find(
                                        (button) =>
                                            button.customId === "todConfirm"
                                    )
                                    .label.replace(/^\D+/g, "")
                                    .charAt(0)
                            );

                            // Removing one skip from player
                            player.todSkips--;

                            // Defining components for last message
                            const components = message.components
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
                                .toSpliced(
                                    message.components.findIndex((actionRow) =>
                                        interaction.client.messageComponents
                                            .filter(
                                                (savedMessageComponent) =>
                                                    savedMessageComponent.type ===
                                                    ComponentType.ActionRow
                                            )
                                            .find(
                                                (savedActionRow) =>
                                                    savedActionRow.name ===
                                                    "todManagement"
                                            )
                                            .messageComponents.every(
                                                (savedButton) =>
                                                    actionRow.components
                                                        .map(
                                                            (button) =>
                                                                button.customId
                                                        )
                                                        .includes(savedButton)
                                            )
                                    ),
                                    1,
                                    null
                                )
                                .filter(Boolean)
                                .map((savedActionRow) =>
                                    savedActionRow.create(interaction, {
                                        general: { disabled: true },
                                        todConfirm: {
                                            label:
                                                session.playerIds.length === 2
                                                    ? null
                                                    : `Confirm [${confirmedCounter}/${Math.ceil(
                                                          session.playerIds
                                                              .length / 2
                                                      )}]`,
                                        },
                                        todCustomTruthOrDare: {
                                            label: `Custom ${tod}`,
                                            style,
                                        },
                                        todRandomTruthOrDare: {
                                            label: `Random ${tod} [${randomCounter}/3]`,
                                            style: ButtonStyle.Success,
                                        },
                                        todSkip: {
                                            label: `Skip [${player.todSkips}/${session.skips}]`,
                                            style: ButtonStyle.Success,
                                        },
                                    })
                                );

                            // Updating last message
                            await interaction.update({ components });

                            // Determining questioner and answerer
                            session.answererId = session.questionerId;
                            session.questionerId = session.playerIds.filter(
                                (playerId) => playerId !== session.answererId
                            )[
                                Math.floor(
                                    Math.random() *
                                        (session.playerIds.length - 1)
                                )
                            ];

                            // Defining components for follow up message
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
                                        embed.footer.text.startsWith(
                                            "Session ID:"
                                        )
                                    )
                                )
                                    .setDescription(
                                        `${userMention(
                                            session.questionerId
                                        )} says in a threatening voice: Truth or Dare, ${userMention(
                                            session.answererId
                                        )}?`
                                    )
                                    .setFields()
                                    .setAuthor(null),
                            ];

                            // Sending follow up message
                            interaction.followUp({
                                content: `${userMention(
                                    interaction.user.id
                                )} skips this ${tod}!`,
                                components,
                                embeds,
                            });

                            // Updating player and session in client
                            interaction.client.players.set(
                                interaction.user.id,
                                player
                            );
                            interaction.client.sessions.set(sessionId, session);
                        }
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: `It is ${userMention(
                                session.answererId
                            )}'${
                                (
                                    await interaction.guild.members.fetch(
                                        session.answererId
                                    )
                                ).nickname
                                    .toLowerCase()
                                    .endsWith("s")
                                    ? ""
                                    : "s"
                            } turn to answer this Truth or Dare, be patient and wait for your turn!`,
                            ephemeral: true,
                        });
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
                        "You cannot interact with this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            }
        } else {
            // Replying to interaction
            interaction.reply({
                content:
                    "You cannot interact with this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        }
    },
};
