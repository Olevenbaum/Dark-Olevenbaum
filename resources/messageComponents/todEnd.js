// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "todEnd",
    type: ComponentType.Button,

    // Creating message component
    create(interaction) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel("End")
            .setStyle(ButtonStyle.Danger);
    },

    // Handling interaction
    async execute(interaction) {
        // Searching for player
        const player = await interaction.client.sequelize.models.player.findOne(
            {
                attributes: ["id"],
                where: { id: interaction.user.id },
            }
        );

        // Checking if user ever played Truth or Dare
        if (!player) {
            interaction.reply({
                content:
                    "You cannot end this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        } else {
            // Searching for session of this player
            const session = await player.getSession({
                attributes: ["id"],
            });

            // Checking if user is currently playing Truth or Dare
            if (!session) {
                interaction.reply({
                    content:
                        "You cannot end this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            } else {
                // Reading message data
                const message = interaction.message;
                const sessionId = message.embeds[0].footer.text.replace(
                    /^\D+/g,
                    ""
                );

                // Checking if user is playing Truth or Dare in this session
                if (session.id !== parseInt(sessionId)) {
                    interaction.reply({
                        content:
                            "This button does not belong to your current game!",
                        ephemeral: true,
                    });
                } else {
                    const players = await session.getPlayers();

                    // Removing skips from players and players from session
                    await Promise.all(
                        players.map(
                            (player) => player.update({ skips: null }),
                            session.removePlayers()
                        )
                    );

                    // Editing initial message if the button belongs to it
                    if (
                        message.embeds[0].fields[0].name.startsWith("Players")
                    ) {
                        const embed = EmbedBuilder.from(
                            message.embeds[0]
                        ).setFields(
                            {
                                name: `Players [0]:`,
                                value: "- none -",
                            },
                            {
                                inline: true,
                                name: "Rating:",
                                value: `${session.rating}+`,
                            },
                            {
                                inline: true,
                                name: "Skips:",
                                value: `${session.skips}`,
                            }
                        );
                        message.edit({ components: [], embeds: [embed] });
                    } else {
                        // Removing buttons from old message
                        message.edit({ components: [] });
                    }

                    // Deleting session
                    session.destroy();

                    // Replying to interaction
                    interaction.reply(
                        `${userMention(
                            player.id
                        )} has ended this game of Truth or Dare!`
                    );
                }
            }
        }
    },
};
