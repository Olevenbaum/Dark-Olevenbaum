// Importing classes and methods
const {
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "todDareChoice",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Dare")
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
                        // Defining new components for last message
                        const components = message.components.map(
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
                                        todEndSession: { disabled: false },
                                        todJoinSession: { disabled: false },
                                        todLeaveSession: { disabled: false },
                                        todStartSession: {
                                            style: session.active
                                                ? ButtonStyle.Success
                                                : null,
                                        },
                                    })
                        );

                        // Updating last message
                        await interaction.update({ components });

                        // Defining new components for follow up message
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
                                        todStartSession: {
                                            style: ButtonStyle.Success,
                                        },
                                    })
                                )
                        );

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
                                    )}, do you want to dare ${userMention(
                                        session.answererId
                                    )} to do a custom or a random task?`
                                )
                                .setFields(),
                        ];

                        interaction.followUp({ components, embeds });
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: `It is ${userMention(answererId)}'${
                                (
                                    await interaction.guild.members.fetch(
                                        answererId
                                    )
                                ).nickname
                                    .toLowerCase()
                                    .endsWith("s")
                                    ? ""
                                    : "s"
                            } turn, be patient and wait for your turn!`,
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
