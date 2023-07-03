// Importing classes and methods
const {
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting interaction type and name
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

                    // Checking if player is questioner
                    if (player.id === user.id) {
                        // Reading message components
                        const components = message.components;

                        const tod = message.embeds.find((embed) =>
                            embed.footer.text.startsWith("Session ID:")
                        ).title;

                        // Reading number of already used random Truths or Dares
                        const counter = parseInt(
                            components
                                .find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.some(
                                            (messageComponent) =>
                                                messageComponent.type ===
                                                    ComponentType.Button &&
                                                (messageComponent.customId ===
                                                    "todCustomTruthOrDare" ||
                                                    messageComponent.customId ===
                                                        "todRandomTruthOrDare")
                                        )
                                )
                                .find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.Button &&
                                        (messageComponent.customId ===
                                            "todCustomTruthOrDare" ||
                                            messageComponent.customId ===
                                                "todRandomTruthOrDare")
                                )
                                .replace(/^\D+/g, "")[0]
                        );

                        // Reading style of custom truth or dare button
                        const style = components
                            .find(
                                (messageComponent) =>
                                    messageComponent.type ===
                                        ComponentType.ActionRow &&
                                    messageComponent.some(
                                        (messageComponent) =>
                                            messageComponent.type ===
                                                ComponentType.Button &&
                                            (messageComponent.customId ===
                                                "todCustomTruthOrDare" ||
                                                messageComponent.customId ===
                                                    "todRandomTruthOrDare")
                                    )
                            )
                            .find(
                                (messageComponent) =>
                                    messageComponent.type ===
                                        ComponentType.Button &&
                                    messageComponent.customId ===
                                        "todCustomTruthOrDare"
                            ).style;

                        // Editing old message
                        components.splice(
                            components.findIndex((messageComponent) =>
                                messageComponent.components.some(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.Button &&
                                        (messageComponent.customId ===
                                            "todCustomTruthOrDare" ||
                                            messageComponent.customId ===
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
                                    todCustomTruthOrDare: {
                                        disabled: style === ButtonStyle.Success,
                                        style,
                                    },
                                    todRandomTruthOrDare: {
                                        disabled: counter === 1,
                                        label: `Random [${counter}/3]`,
                                        style:
                                            counter === 3
                                                ? ButtonStyle.Primary
                                                : ButtonStyle.Success,
                                    },
                                })
                        );

                        message.edit({ components });

                        // Replying to interaction
                        components.splice(0, components.length);
                        interaction.client.messageComponents
                            .filter(
                                (messageComponent) =>
                                    (messageComponent.type ===
                                        ComponentType.ActionRow &&
                                        messageComponent.name ===
                                            "todPlayerManagement") ||
                                    messageComponent.name ===
                                        "todCustomOrRandom" ||
                                    messageComponent.name === "todNextRound"
                            )
                            .every((messageComponent) => {
                                components.push(
                                    messageComponent.create(interaction, {
                                        todRandomTruthOrDare:
                                            messageComponent.name ===
                                            "todCustomOrRandom"
                                                ? {
                                                      label: `New random [${
                                                          counter - 1
                                                      }/3]`,
                                                  }
                                                : null,
                                    })
                                );
                            });

                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setTitle(`Random ${tod}`)
                                .setDescription()
                                .setAuthor({
                                    name: interaction.client.user.username,
                                    iconURL:
                                        interaction.client.user.avatarURL(),
                                }),
                        ];

                        interaction.reply({ components, embeds });
                    } else if (player.id === answerer.id) {
                        // Replying to interaction
                        interaction.reply({
                            content: `You do not get to decide for yourself!`,
                            ephemeral: true,
                        });
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
