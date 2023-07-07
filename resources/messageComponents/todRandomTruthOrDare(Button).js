// Importing classes and methods
const {
    ButtonBuilder,
    ComponentType,
    ButtonStyle,
    EmbedBuilder,
    userMention,
} = require("discord.js");

// Importing Truths or Dares
const tods = require("../../database/constantTables/tods.json");

module.exports = {
    // Setting message component name and type
    name: "todRandomTruthOrDare",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Random [3/3]")
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
                            .title.replace("Random ", "")
                            .replace("Custom ", "");

                        // Reading number of already used random Truths or Dares
                        const counter =
                            parseInt(
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
                            ) - 1;

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
                                    .messageComponents.every((savedButton) =>
                                        actionRow.components
                                            .map((button) => button.customId)
                                            .includes(savedButton)
                                    )
                            )
                            .components.find(
                                (button) =>
                                    button.customId === "todCustomTruthOrDare"
                            ).style;

                        // Defining embed for last message
                        const embeds = [
                            EmbedBuilder.from(
                                message.embeds.find((embed) =>
                                    embed.footer.text.startsWith("Session ID:")
                                )
                            )
                                .setTitle(`Random ${tod}`)
                                .setDescription(
                                    tods.filter(
                                        (tod) =>
                                            tod.type === tod.toLowerCase() &&
                                            tod.rating <= session.rating
                                    )[Math.random() * tods.length].text
                                )
                                .setAuthor({
                                    name: interaction.client.user.username,
                                    iconURL:
                                        interaction.client.user.avatarURL(),
                                    url: "https://github.com/Olevenbaum/Dark-Olevenbaum",
                                }),
                        ];

                        // Defining components for last message
                        const components = message.components.map((actionRow) =>
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
                                                    (button) => button.customId
                                                )
                                                .includes(savedButton)
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
                                    ),
                                    0,
                                    counter !== 3 ||
                                        style === ButtonStyle.Success
                                        ? interaction.client.messageComponents
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
                                        : null
                                )
                                .filter(Boolean)
                                .map((savedActionRow) =>
                                    savedActionRow.create(interaction, {
                                        todCustomTruthOrDare: {
                                            disabled:
                                                style === ButtonStyle.Success,
                                            label: `Custom ${tod}`,
                                            style,
                                        },
                                        todRandomTruthOrDare: {
                                            disabled: counter === 0,
                                            label: `Random ${tod} [${counter}/3]`,
                                            style:
                                                counter === 3
                                                    ? null
                                                    : ButtonStyle.Success,
                                        },
                                        todStartSession: {
                                            disabled: true,
                                            style: session.active
                                                ? ButtonStyle.Success
                                                : null,
                                        },
                                    })
                                )
                        );

                        // Updating last message
                        interaction.update({ components, embeds });

                        // Sending follow up message
                        interaction.followUp(
                            `${userMention(
                                interaction.user.id
                            )} chose a new random ${tod}!`
                        );
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
                            } turn to decide whether to choose a custom or random ${tod}, be patient and wait for your turn!`,
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
