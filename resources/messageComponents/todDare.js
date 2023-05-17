// Importing classes and methods
const { ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todDare",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel("Dare")
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
                    // Checking if player is answerer
                    if (player === (await session.getAnswerer())) {
                        // Editing old message
                        let components = message.components.splice(
                            message.components.findIndex((component) =>
                                component.components.some(
                                    (component) =>
                                        component.type ===
                                            ComponentType.Button &&
                                        (component.customId === "todDare" ||
                                            component.customId ===
                                                "todRandom" ||
                                            component.customId === "todTruth")
                                )
                            ),
                            1,
                            interaction.client.messageComponents
                                .find(
                                    (messageComponent) =>
                                        messageComponent.type ===
                                            ComponentType.ActionRow &&
                                        messageComponent.name ===
                                            "todDareRandomTruth"
                                )
                                .create(interaction, {
                                    general: { disabled: true },
                                    todDare: { style: ButtonStyle.Success },
                                })
                        );

                        message.edit({ components });

                        // Replying to interaction
                        components = interaction.client.messageComponents
                            .filter(
                                (messageComponent) =>
                                    messageComponent.type ===
                                    ComponentType.ActionRow
                            )
                            .map((messageComponent) =>
                                messageComponent.create(interaction)
                            );

                        const embeds = [];

                        interaction.reply({ components, embeds });
                    } else {
                        // Replying to interaction
                        interaction.reply({
                            content: "Wait for your turn!",
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
