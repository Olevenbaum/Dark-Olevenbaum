// Importing classes and methods
const {
    ComponentType,
    EmbedBuilder,
    StringSelectMenuBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting message components name, options and type
    name: "kmkKillChoiceInput",
    options: [],
    type: ComponentType.StringSelect,

    // Creating message component
    create(interaction, options) {
        return new StringSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? 1)
            .setMinValues(options.minimalValues ?? 1)
            .setPlaceholder(options.placeholder ?? "Kill")
            .addOptions(options.options ?? this.options);
    },

    // Handling interaction
    async execute(interaction) {
        // Fetching message with embed
        const message = await interaction.channel.messages.fetch(
            interaction.message.reference.messageId
        );

        // Reading embed of message
        const embed = message.embeds.find(
            (embed) => embed.title === "Kiss Marry Kill"
        );

        // Reading subcommand
        const subcommand = embed.footer.text.includes("server")
            ? "server"
            : "celebrities";

        // Creating array of players and their chosen options
        const playersOptions = [];

        // Defining duplicate indicator
        let duplicate = false;

        // Checking if embed has fields
        if (embed.fields.length === 0) {
            // Adding player
            playersOptions.push({
                id: userMention(interaction.user.id),
                kill:
                    subcommand === "server"
                        ? userMention(interaction.values.at(0))
                        : interaction.values.at(0),
            });
        } else {
            // Reading players field
            const players = embed.fields
                .find((field) => field.name.startsWith("Players:"))
                .value.split(",\n")
                .map((playerMention) => playerMention.replace(/[^0-9]/g, ""));

            // Reading kiss field
            const kiss = embed.fields
                .find((field) => field.name.startsWith("Kiss:"))
                .value.split(",\n")
                .map((option) =>
                    option && !option.includes("none")
                        ? subcommand === "server"
                            ? option.replace(/[^0-9]/g, "")
                            : option
                        : null
                );

            // Reading marry field
            const marry = embed.fields
                .find((field) => field.name.startsWith("Marry:"))
                .value.split(",\n")
                .map((option) =>
                    option && !option.includes("none")
                        ? subcommand === "server"
                            ? option.replace(/[^0-9]/g, "")
                            : option
                        : null
                );

            // Reading kill field
            const kill = embed.fields
                .find((field) => field.name.startsWith("Kill:"))
                .value.split(",\n")
                .map((option) =>
                    option && !option.includes("none")
                        ? subcommand === "server"
                            ? option.replace(/[^0-9]/g, "")
                            : option
                        : null
                );

            // Searching for player
            const playersPosition = players.findIndex(
                (playerId) => playerId === interaction.user.id
            );

            if (playersPosition === -1) {
                // Checking if player already chose
                // Adding player
                players.push(interaction.user.id);

                // Adding options
                kill.push(interaction.values.at(0));
            } else {
                // Checking for duplicates
                if (
                    kiss.at(playersPosition) === interaction.values.at(0) ||
                    marry.at(playersPosition) === interaction.values.at(0)
                ) {
                    // Updating dupilicate indicator
                    duplicate = true;

                    // Replying to interation
                    interaction.reply({
                        content:
                            "You cannot use one and the same person in two spots!",
                        ephemeral: true,
                    });
                }
            }

            // Checking if duplicate was found
            if (!duplicate) {
                // Editing players in players
                players.splice(
                    0,
                    players.length,
                    ...players.map((option) => userMention(option))
                );

                // Checking subcommand
                if (subcommand === "server") {
                    // Editing options in kiss
                    kiss.splice(
                        0,
                        kiss.length,
                        ...kiss.map((option) =>
                            option ? userMention(option) : option
                        )
                    );

                    // Editing options in marry
                    marry.splice(
                        0,
                        marry.length,
                        ...marry.map((option) =>
                            option ? userMention(option) : option
                        )
                    );

                    // Editing options in kill
                    kill.splice(
                        0,
                        kill.length,
                        ...kill.map((option) =>
                            option ? userMention(option) : option
                        )
                    );
                }

                // Iteracting over players
                players.forEach((playerId, index) =>
                    playersOptions.push({
                        id: playerId,
                        kill:
                            interaction.user.id === playerId
                                ? interaction.values.at(0)
                                : kill.at(index),
                        kiss: kiss.at(index),
                        marry: marry.at(index),
                    })
                );
            }
        }

        // Checking if dupicate was found
        if (!duplicate) {
            // Defining embeds
            const embeds = [
                EmbedBuilder.from(embed).setFields(
                    {
                        name: "Players:",
                        value: playersOptions
                            .map((player, index) =>
                                index === 0 ? `- ${player.id}` : player.id
                            )
                            .join(",\n- "),
                    },
                    {
                        inline: true,
                        name: "Kiss:",
                        value: playersOptions
                            .map((player, index) =>
                                player.kiss
                                    ? index === 0
                                        ? `- ${player.kiss}`
                                        : player.kiss
                                    : index === 0
                                    ? "- none"
                                    : "none"
                            )
                            .join(",\n- "),
                    },
                    {
                        inline: true,
                        name: "Marry:",
                        value: playersOptions
                            .map((player, index) =>
                                player.marry
                                    ? index === 0
                                        ? `- ${player.marry}`
                                        : player.marry
                                    : index === 0
                                    ? "- none"
                                    : "none"
                            )
                            .join(",\n- "),
                    },
                    {
                        inline: true,
                        name: "Kill:",
                        value: playersOptions
                            .map((player, index) =>
                                player.kill
                                    ? index === 0
                                        ? `- ${player.kill}`
                                        : player.kill
                                    : index === 0
                                    ? "- none"
                                    : "none"
                            )
                            .join(",\n- "),
                    }
                ),
            ];

            // Updating message
            message.edit({ embeds });

            // Updating interaction message
            interaction.update({
                content: `Thank you for your contribution! Check out the original message to see what others have chosen!`,
                ephemeral: true,
            });
        }
    },
};
