// Importing classes and methods
const { ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "todStart",
    type: ComponentType.Button,

    // Creating message component
    create(interaction) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel("Start")
            .setStyle(ButtonStyle.Primary);
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
                    "You cannot start this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        } else {
            // Searching for session of this player
            const session = await player.getSession({
                attributes: ["id", "rating", "skips"],
            });

            // Checking if user is currently playing Truth or Dare
            if (!session) {
                interaction.reply({
                    content:
                        "You cannot start this game, try joining a game before randomly pressing buttons!",
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

                    // Checking if there are enough players to start a game
                    if (players.length === 0) {
                        interaction.reply({
                            content:
                                "There are not enough players to start a game! You need at least one more player!",
                            ephemeral: true,
                        });
                    }
                }
            }
        }
    },
};
