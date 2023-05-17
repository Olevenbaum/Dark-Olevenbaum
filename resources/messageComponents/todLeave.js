// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "todLeave",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel("Leave")
            .setStyle(options.style ?? ButtonStyle.Danger);
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
                    // Checking if player has to answer or question at the moment
                    const answerer = await session.getAnswerer();
                    const questioner = await session.getQuestioner();

                    if (answerer === player.id) {
                        // Replying to interaction
                        interaction.reply({
                            content: `Coward, do not run from your responsibilities! Stay in this game and answer your question from ${userMention(
                                questioner.id
                            )} before leaving!`,
                            ephemeral: true,
                        });
                    } else if (questioner === player.id) {
                        // Replying to interaction
                        interaction.reply({
                            content: `You have to ask ${userMention(
                                answerer.id
                            )} a question before leaving!`,
                            ephemeral: true,
                        });
                    } else {
                        // Removing skips from player and player from session
                        await Promise.all([
                            session.removePlayer(player),
                            player.update({ skips: null }),
                        ]);

                        // Searching for players of session
                        const players = await session.getPlayers();

                        // Reading old embed
                        const initialEmbed = message.embeds.find((embed) =>
                            embed.fields.some((field) =>
                                field.name.startsWith("Players")
                            )
                        );

                        // Editing initial message if the button belongs to it
                        if (initialEmbed) {
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
                                initialEmbed
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

                        // Deleting session and removing buttons if there are not enough players left
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
                        "You cannot leave this game, try joining a game before randomly pressing buttons!",
                    ephemeral: true,
                });
            }
        } else {
            // Replying to interaction
            interaction.reply({
                content:
                    "You cannot leave this game, try joining a game before randomly pressing buttons!",
                ephemeral: true,
            });
        }
    },
};
