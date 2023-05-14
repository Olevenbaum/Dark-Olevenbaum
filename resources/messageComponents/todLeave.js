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
    name: "todLeave",
    type: ComponentType.Button,

    // Creating message component
    create(interaction) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel("Leave")
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
                    "You cannot leave this game, try joining a game before randomly pressing buttons!",
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
                        "You cannot leave this game, try joining a game before randomly pressing buttons!",
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
                    // Checking if player has to answer or question at the moment
                    const answerer = await session.getAnswerer({
                        attributes: ["id"],
                    });
                    const questioner = await session.getQuestioner({
                        attributes: ["id"],
                    });
                    if (answerer === player.id) {
                        interaction.reply({
                            content: `Coward, do not run from your responsibilities! Stay in this game and answer you question from ${userMention(
                                questioner.id
                            )} before leaving!`,
                            ephemeral: true,
                        });
                    } else if (questioner === player.id) {
                        interaction.reply({
                            content: `You have to ask ${userMention(
                                answerer.id
                            )} a question before leaving!`,
                            ephemeral: true,
                        });
                    } else {
                        // Remove player from session
                        await session.removePlayer(player);
                        player.update({ skips: null });

                        const players = await session.getPlayers();

                        // Editing initial message if the button belongs to it
                        if (
                            message.embeds[0].fields[0].name.startsWith(
                                "Players"
                            )
                        ) {
                            let playersString = "";
                            if (players.length === 0) {
                                playersString = "- none -";
                            } else {
                                players.forEach(
                                    (player) =>
                                        (playersString += `\n- ${userMention(
                                            player.id
                                        )}`)
                                );
                            }
                            const embed = EmbedBuilder.from(
                                message.embeds[0]
                            ).setFields(
                                {
                                    name: `Players [${players.length}]:`,
                                    value: playersString,
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
                            message.edit({ embeds: [embed] });
                        }

                        // Deleting session if there are not enough players left
                        if (players.length === 0) {
                            session.destroy();

                            message.edit({ components: [] });
                        }

                        // Replying to interaction
                        interaction.reply(
                            `${userMention(player.id)} has left the game${
                                players.length === 0
                                    ? " and thereby ended it"
                                    : ""
                            }!`
                        );
                    }
                }
            }
        }
    },
};
