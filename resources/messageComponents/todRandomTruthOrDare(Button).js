// Importing classes and methods
const { ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js");
const { Op } = require("sequelize");

module.exports = {
    // Setting interaction type and name
    name: "todRandomDareOrTruth",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Random")
            .setStyle(options.style ?? ButtonStyle);
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
                        questioner.id
                    );

                    // Checking if player is answerer
                    if (player.id === user.id) {
                        // Reading message components
                        const components = message.components;

                        const tod = message.embeds
                            .find((embed) =>
                                embed.footer.text.startsWith("Session ID:")
                            )
                            .title.toLowerCase();

                        // Reading number of already used random Truths or Dares
                        const counter = message.embeds
                            .find((embed) =>
                                embed.footer.text.startsWith("Session ID:")
                            )
                            .description.replace();

                        // Editing old message
                        components.splice(
                            components.findIndex((component) =>
                                component.components.some(
                                    (component) =>
                                        component.type ===
                                            ComponentType.Button &&
                                        (component.customId ===
                                            "todCustomTruthOrDare" ||
                                            component.customId ===
                                                "todRandomTruthOrDare")
                                )
                            ),
                            1,
                            interaction.client.messageComponents
                                .find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.name ===
                                            "todCustomOrRandom"
                                )
                                .create(interaction, {
                                    general: { disabled: true },
                                    todRandomTruthOrDare: {
                                        style: ButtonStyle.Success,
                                    },
                                })
                        );

                        message.edit({ components });

                        // Replying to interaction
                        const tods =
                            await interaction.client.sequelize.models.tod.findAll(
                                {
                                    where: {
                                        kind: "",
                                        rating: {
                                            [Op.gte]: session.rating,
                                        },
                                    },
                                }
                            );
                        components.splice(
                            0,
                            components.length,
                            interaction.client.messageComponents
                                .filter(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.name === "todNextRound"
                                )
                                .map((messageComponent) =>
                                    messageComponent.create(interaction)
                                )
                        );

                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setTitle(`Random Dare [${counter}/3]`)
                                .setDescription()
                                .setAuthor({
                                    name: user.username,
                                    iconURL: user.avatarURL(),
                                }),
                        ];

                        interaction.reply({ components, embeds });
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: `It is ${userMention(user.id)}'${
                                user.username.toLowerCase().endsWith("s")
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
