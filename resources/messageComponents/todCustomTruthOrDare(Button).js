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
    name: "todCustomTruthOrDare",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Custom")
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
                    // Checking if player is questioner
                    if (interaction.user.id === session.questionerId) {
                        // Reading Truth or Dare from embed of last message
                        const tod = message.embeds
                            .find((embed) =>
                                embed.footer.text.startsWith("Session ID:")
                            )
                            .title.replace("Custom ", "")
                            .replace("Random ", "");

                        // Defining embed for last message
                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setTitle(`Custom ${tod}`)
                                .setDescription(
                                    `${userMention(
                                        session.questionerId
                                    )} is currently determining a custom ${tod} for ${userMention(
                                        session.answererId
                                    )}! Wait for them to finish!`
                                )
                                .setAuthor({
                                    name: (
                                        await interaction.guild.members.fetch(
                                            interaction.user.id
                                        )
                                    ).nickname,
                                    iconURL: interaction.user.avatarURL(),
                                }),
                        ];

                        // Showing modal to player
                        interaction.showModal(
                            interaction.client.modals
                                .get("todCustomTruthOrDareInput")
                                .create(interaction, {
                                    titel: `Custom ${tod}`,
                                    todCustomTruthOrDareInputField: {
                                        label: `Custom ${tod}`,
                                        placeholder: `Enter your custom ${tod} here!`,
                                    },
                                })
                        );

                        // Editing last message
                        message.edit({ embeds });
                    } else if (interaction.user.id === session.answererId) {
                        // Replying to interaction
                        interaction.reply({
                            content: `You do not get to decide for yourself!`,
                            ephemeral: true,
                        });
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: `It is ${userMention(
                                session.questionerId
                            )}'${
                                (
                                    await interaction.guild.members.fetch(
                                        session.questionerId
                                    )
                                ).nickname
                                    .toLowerCase()
                                    .endsWith("s")
                                    ? ""
                                    : "s"
                            } turn to decide whether to choose Truth or Dare, be patient and wait for your turn!`,
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
