// Importing classes and methods
const {
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting message component name and type
    name: "todTruthChoice",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Truth")
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
                        // Defining components for last message
                        const components = message.components
                            .map((oldMessageComponent) =>
                                interaction.client.messageComponents.find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.messageComponents.every(
                                            (messageComponent) =>
                                                oldMessageComponent.components
                                                    .map(
                                                        (messageComponent) =>
                                                            messageComponent.customId
                                                    )
                                                    .includes(messageComponent)
                                        )
                                )
                            )
                            .with(
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
                                null
                            )
                            .filter(Boolean)
                            .map((savedActionRow) =>
                                savedActionRow.create(interaction, {
                                    general: { disabled: true },
                                    todTruthChoice: {
                                        style: ButtonStyle.Success,
                                    },
                                })
                            );

                        // Updating last message
                        await interaction.update({ components });

                        // Defining components for follow up message
                        components.splice(
                            0,
                            components.length,
                            ...interaction.client.messageComponents
                                .filter(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        (messageComponent.name ===
                                            "todCustomOrRandom" ||
                                            messageComponent.name ===
                                                "todManagement")
                                )
                                .map((messageComponent) =>
                                    messageComponent.create(interaction, {
                                        todCustomTruthOrDare: {
                                            label: "Custom Truth",
                                        },
                                        todRandomTruthOrDare: {
                                            label: "Random Truth [3/3]",
                                        },
                                        todStartSession: {
                                            disabled: true,
                                            style: ButtonStyle.Success,
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
                                .setTitle("Dare")
                                .setDescription(
                                    `${userMention(
                                        session.questionerId
                                    )}, do you want to ask ${userMention(
                                        interaction.user.id
                                    )} a custom or a random question?`
                                )
                                .setFields(),
                        ];

                        interaction.followUp({ components, embeds });
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
                            } turn to choose Truth or Dare, be patient and wait for your turn!`,
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
