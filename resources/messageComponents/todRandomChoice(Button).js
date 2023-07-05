// Importing classes and methods
const {
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todRandomChoice",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Random")
            .setStyle(options.style ?? ButtonStyle.Secondary);
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

                // Searching embed for session ID
                const sessionId = parseInt(
                    message.embeds
                        .find((embed) =>
                            embed.footer.text.startsWith("Session ID:")
                        )
                        .footer.text.replace(/^\D+/g, "")
                );

                // Checking if user is playing Truth or Dare in this session
                if (session.id === sessionId) {
                    // Searching for answerer and questioner
                    const answerer = await session.getAnswerer();
                    const questioner = await session.getQuestioner();

                    const user = await interaction.client.users.fetch(
                        answerer.id
                    );

                    // Checking if player is answerer
                    if (player.id === user.id) {
                        // Reading message components
                        const components = message.components;

                        // Editing old message
                        components.splice(
                            components.findIndex((messageComponent) =>
                                messageComponent.components.some(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.Button &&
                                        (messageComponent.customId ===
                                            "todDareChoice" ||
                                            messageComponent.customId ===
                                                "todRandomChoice" ||
                                            messageComponent.customId ===
                                                "todTruthChoice")
                                )
                            ),
                            1,
                            interaction.client.messageComponents
                                .find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.name === "todChoices"
                                )
                                .create(interaction, {
                                    general: { disabled: true },
                                    todRandomChoice: {
                                        style: ButtonStyle.Success,
                                    },
                                })
                        );

                        message.edit({ components });

                        // Replying to interaction
                        components.splice(
                            0,
                            components.length,
                            ...interaction.client.messageComponents
                                .filter(
                                    (messageComponent) =>
                                        (messageComponent.type ===
                                            ComponentType.ActionRow &&
                                            messageComponent.name ===
                                                "todPlayerManagement") ||
                                        messageComponent.name ===
                                            "todCustomOrRandom"
                                )
                                .map((messageComponent) =>
                                    messageComponent.create(interaction)
                                )
                        );

                        // Determining Truth or Dare
                        const tod = Math.random() < 0.5;

                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setTitle(tod ? "Dare" : "Truth")
                                .setDescription(
                                    `${userMention(
                                        questioner.id
                                    )}, do you want to ${
                                        tod ? "dare" : "ask"
                                    } ${userMention(user.id)} ${
                                        tod ? "to do" : ""
                                    } a custom or a random ${
                                        tod ? "task" : "question"
                                    }?`
                                ),
                        ];

                        interaction.reply({ components, embeds });
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: `It is ${userMention(user.id)}'${
                                user.username.toLowerCase().endsWith("s")
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
