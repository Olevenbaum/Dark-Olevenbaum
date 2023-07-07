// Importing classes and methods
const {
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    ModalBuilder,
} = require("discord.js");

module.exports = {
    // Setting modals message components and name
    messageComponents: ["todCustomTruthOrDareInput"],
    name: "todCustomTruthOrDareInput",

    // Creating modal
    create(interaction, options = {}) {
        return new ModalBuilder()
            .setCustomId(this.name)
            .setTitle(options.titel ?? "Truth or Dare")
            .addComponents(
                interaction.client.messageComponents
                    .filter(
                        (messageComponent) =>
                            messageComponent.type === ComponentType.ActionRow &&
                            this.messageComponents.includes(
                                messageComponent.name
                            )
                    )
                    .map((messageComponent) =>
                        messageComponent.create(interaction, {
                            ...options.general,
                            ...options[messageComponent.name],
                        })
                    )
            );
    },

    // Handling interaction
    async execute(interaction) {
        // Reading last message
        const { message } = interaction;

        // Searching embed of last message for session ID
        const sessionId = parseInt(
            message.embeds
                .find((embed) => embed.footer.text.startsWith("Session ID:"))
                .footer.text.replace(/^\D+/g, "")
        );

        // Reading Truth or Dare from embed of last message
        const tod = message.embeds
            .find((embed) => embed.footer.text.startsWith("Session ID:"))
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
                                savedActionRow.name === "todCustomOrRandom"
                        )
                        .messageComponents.every((savedButton) =>
                            actionRow.components
                                .map((button) => button.customId)
                                .includes(savedButton)
                        )
                )
                .components.find(
                    (button) => button.customId === "todRandomTruthOrDare"
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
                            savedActionRow.name === "todCustomOrRandom"
                    )
                    .messageComponents.every((savedButton) =>
                        actionRow.components
                            .map((button) => button.customId)
                            .includes(savedButton)
                    )
            )
            .components.find(
                (button) => button.customId === "todCustomTruthOrDare"
            ).style;

        // Searching for Truth or Dare session of this player
        const session = interaction.client.sessions.get(sessionId);

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
                        savedActionRow.messageComponents.every((savedButton) =>
                            actionRow.components
                                .map((button) => button.customId)
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
                                savedActionRow.name === "todCustomOrRandom"
                        )
                        .messageComponents.every((savedButton) =>
                            actionRow.components
                                .map((button) => button.customId)
                                .includes(savedButton)
                        )
                ),
                0,
                randomCounter === 3
                    ? interaction.client.messageComponents
                          .filter(
                              (savedMessageComponent) =>
                                  savedMessageComponent.type ===
                                  ComponentType.ActionRow
                          )
                          .find(
                              (savedActionRow) =>
                                  savedActionRow.name === "todNextRound"
                          )
                    : null
            )
            .filter(Boolean)
            .map((savedActionRow) =>
                savedActionRow.create(interaction, {
                    todConfirm: {
                        label:
                            session.playerIds.length === 2
                                ? null
                                : `Confirm [0/${Math.ceil(
                                      session.playerIds.length / 2
                                  )}]`,
                    },
                    todCustomTruthOrDare: {
                        disabled: true,
                        label: `Custom ${tod}`,
                        style: ButtonStyle.Success,
                    },
                    todRandomTruthOrDare: {
                        disabled: randomCounter === 0,
                        label: `Random ${tod} [${randomCounter}/3]`,
                        style: randomCounter === 3 ? null : ButtonStyle.Success,
                    },
                    todSkip: {
                        label: `Skip [${
                            interaction.client.players.get(session.answererId)
                                .todSkips
                        }/${session.skips}]`,
                    },
                    todStartSession: {
                        disabled: true,
                        style: ButtonStyle.Success,
                    },
                })
            );

        // Defining embed for last message
        const embeds = [
            EmbedBuilder.from(
                message.embeds.find((embed) =>
                    embed.footer.text.startsWith("Session ID:")
                )
            )
                .setTitle(`Custom ${tod}`)
                .setDescription(
                    interaction.fields.getTextInputValue(
                        "todCustomTruthOrDareInputField"
                    )
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

        // Updating last message
        interaction.update({ components, embeds });

        // Updating session in client
        interaction.client.sessions.set(sessionId, session);
    },
};
