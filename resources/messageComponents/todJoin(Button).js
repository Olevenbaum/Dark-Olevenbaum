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
    name: "todJoin",
    type: ComponentType.Button,

    // Creating message component
    create(interaction, options = {}) {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setLabel(options.label ?? "Join")
            .setStyle(options.style ?? ButtonStyle.Primary);
    },

    // Handling interaction
    async execute(interaction) {
        // Searching for player or creating new player
        const [player] =
            await interaction.client.sequelize.models.player.findOrCreate({
                default: { id: interaction.user.id },
                where: { id: interaction.user.id },
            });

        // Searching for session of this player
        let session = await player.getSession();

        // Reading message data
        const message = interaction.message;

        // Searching embed for session ID
        const sessionId = parseInt(
            message.embeds
                .find((embed) => embed.footer.text.startsWith("Session ID:"))
                .footer.text.replace(/^\D+/g, "")
        );

        // Checking if user is currently playing Truth or Dare
        if (session) {
            if (session.id === sessionId) {
                // Replying to interaction
                interaction.reply({
                    content: "You cannot join this game twice!",
                    ephemeral: true,
                });
            } else {
                // Replying to interaction
                interaction.reply({
                    content:
                        "You cannot join this game since you already joined another one!",
                    ephemeral: true,
                });
            }
        } else {
            // Searching for session
            session =
                await interaction.client.sequelize.models.session.findByPk(
                    sessionId
                );

            // Adding player to session
            session.addPlayer(player);

            // Searching for players of session
            const players = await session.getPlayers();

            // Reading old embed
            const initialEmbed = message.embeds.find((embed) =>
                embed.fields.some((field) => field.name.startsWith("Players"))
            );

            // Editing initial message if the button belongs to it
            if (initialEmbed) {
                let playersString = "";
                players.forEach(
                    (player) =>
                        (playersString += `\n- ${userMention(player.id)}`)
                );
                const embed = EmbedBuilder.from(initialEmbed).setFields(
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

            // Calculating skips based on number average number of skips rounded down
            const skips = session.active
                ? Math.floor(
                      players.reduce((sum, player) => sum + player.skips) /
                          players.length
                  )
                : session.skips;
            player.update({ skips });

            // Replying to interaction
            interaction.reply(`${userMention(player.id)} joined the game!`);
        }
    },
};