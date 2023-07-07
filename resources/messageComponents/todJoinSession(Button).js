// Importing classes and methods
const {
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "todJoinSession",
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
        // Searching for player or creating new one
        if (!interaction.client.players.has(interaction.user.id)) {
            interaction.client.players.set(interaction.user.id, {
                sessionIds: {},
                todSkips: null,
            });
        }
        const player = interaction.client.players.get(interaction.user.id);

        // Reading last message
        const message = interaction.message;

        // Searching embed of last message for session ID
        const sessionId = parseInt(
            message.embeds
                .find((embed) => embed.footer.text.startsWith("Session ID:"))
                .footer.text.replace(/^\D+/g, "")
        );

        // Searching for Truth Or Dare session of this player
        const session = interaction.client.sessions.get(player.sessionIds.tod);

        // Checking if player is currently playing Truth or Dare
        if (session) {
            // Replying to interaction
            interaction.reply({
                content: `You cannot join this game ${
                    player.sessionIds.tod === sessionId
                        ? "twice"
                        : "since you already joined another one"
                }!`,
                ephemeral: true,
            });
        } else {
            // Searching for Truth Or Dare session this player wants to join
            const session = interaction.client.sessions.get(sessionId);

            // Calculating skips based on average number of skips rounded down
            const skips = session.active
                ? Math.floor(
                      session.playerIds
                          .map(
                              (playerId) =>
                                  interaction.client.players.get(playerId)
                                      .todSkips
                          )
                          .reduce((partialSum, skips) => partialSum + skips) /
                          session.playerIds.length
                  )
                : session.skips;
            player.todSkips = skips;

            // Adding player to session
            session.playerIds.push(interaction.user.id);
            player.sessionIds.tod = sessionId;

            // Searching for initial message
            const initialMessage = await (
                await interaction.client.channels.fetch(
                    session.initialMessage.channelId
                )
            ).messages.fetch(session.initialMessage.messageId);

            // Defining embed for initial message
            let playersString = "";
            session.playerIds.forEach(
                (playerId) => (playersString += `\n- ${userMention(playerId)}`)
            );
            const embeds = initialMessage.embeds.map((embed) =>
                embed.fields.some((field) => field.name.startsWith("Players"))
                    ? EmbedBuilder.from(embed).setFields(
                          embed.fields.with(
                              embed.fields.findIndex((field) =>
                                  field.name.startsWith("Players")
                              ),
                              {
                                  name: `Players [${session.playerIds.length}]`,
                                  value: playersString,
                              }
                          )
                      )
                    : embed
            );

            // Checking if last message is initial message
            if (message.id === initialMessage.id) {
                // Updating initial message
                await interaction.update({ embeds });

                // Sending follow up message
                interaction.followUp(
                    `${userMention(interaction.user.id)} joined the game!`
                );
            } else {
                // Editing initial message
                initialMessage.edit({
                    embeds,
                });

                // Replying to interaction
                interaction.reply(
                    `${userMention(interaction.user.id)} joined the game!`
                );
            }

            // Updating player and session in client
            interaction.client.sessions.set(sessionId, session);
            interaction.client.players.set(interaction.user.id, player);
        }
    },
};
