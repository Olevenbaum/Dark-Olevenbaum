// Importing classes and methods
const {
    ApplicationCommandType,
    ComponentType,
    EmbedBuilder,
    SlashCommandBuilder,
    userMention,
} = require("discord.js");

module.exports = {
    // Setting command information, kind and options
    data: new SlashCommandBuilder()
        .setName("kmk")
        .setDescription("Starts a new game of Kiss Marry Kill")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("celebrities")
                .setDescription(
                    "Starts a new game of Kiss Marry Kill with celebrities"
                )
                .addBooleanOption((option) =>
                    option
                        .setName("custom")
                        .setDescription(
                            "Specifies wheter you want to give three _s or let the bot choose at random"
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName("category")
                        .setDescription(
                            "Specifies the category the celebrities should be chosen from (ignored for custom)"
                        )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("server")
                .setDescription(
                    "Starts a new game of Kiss Marry Kill with server members"
                )
                .addBooleanOption((option) =>
                    option
                        .setName("custom")
                        .setDescription(
                            "Specifies wheter you want to give three _s or let the bot choose at random"
                        )
                )
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription(
                            "Specifies the channel the server members should to be chosen from (ignored for custom)"
                        )
                )
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription(
                            "Specifies the role the server members should to be chosen from (ignored for custom)"
                        )
                )
        ),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {},

    // Handling command reponse
    async execute(interaction) {
        // Reading shared option
        const custom = interaction.options.getBoolean("custom") ?? false;

        // Defining reply object
        const reply = {};

        // Variable for message components of reply
        const messageComponentNames = [];

        // Checking if command option custom is true
        if (custom) {
            // Editing subcommand specific reply
            switch (interaction.options.getSubcommand()) {
                case "celebrities":
                    // Adding components
                    messageComponentNames.push("kmkCustomCelebrities");
                    break;
                case "server":
                    // Adding components
                    messageComponentNames.push("kmkCustomServer");
                    break;
            }

            // Setting reply to ephemeral
            reply.ephemeral = true;
        } else {
            // Defining _s
            const _s = [];

            // Editing subcommand specific reply
            switch (interaction.options.getSubcommand()) {
                case "celebrities":
                    // Reading option value
                    const category = interaction.options.getString("category");

                    // Adding _s
                    _s.push(
                        require("../../database/constantTables/kmkCelebrities.json").filter(
                            (celebrity) =>
                                category
                                    ? celebrity.category === category
                                    : true
                        )
                    );
                    break;
                case "server":
                    // Reading options values
                    const channel = interaction.options.getChannel("channel");
                    const role = interaction.options.getRole("role");

                    // Adding _s
                    _s.push(
                        ...(await interaction.guild.members.fetch())
                            .filter((member) => !member.user.bot)
                            .filter((member) =>
                                channel ? channel.members.has(member.id) : true
                            )
                            .filter((member) =>
                                role ? role.members.has(member.id) : true
                            )
                            .map((member) => userMention(member.id))
                    );
                    break;
            }

            // Picking three random _s
            _s.shuffle();
            _s.splice(3);

            // Defining embed for reply message
            reply.embeds = [
                new EmbedBuilder()
                    .setTitle("Kiss Marry Kill")
                    .setDescription(
                        `The three _ are: ${_s.reduce(
                            (_sString, _, index) =>
                                (_sString +=
                                    index === 0
                                        ? `${_},`
                                        : index === _s.length - 1
                                        ? `and ${_}`
                                        : _)
                        )}`
                    )
                    .setFooter({
                        text: `_ chosen among ${
                            interaction.options.getSubcommand() ===
                            "celebrities"
                                ? `famous ${interaction.options.getString(
                                      "category"
                                  )}s`
                                : "members of this server"
                        }!`,
                    }),
            ];

            // Adding components
            messageComponentNames.push("kmkManagement");
        }

        // Defining components for reply message
        reply.components = [
            interaction.client.messageComponents
                .filter(
                    (savedMessageComponent) =>
                        savedMessageComponent.type ===
                            ComponentType.ActionRow &&
                        messageComponentNames.includes(
                            savedMessageComponent.name
                        )
                )
                .map((savedActionRow) =>
                    savedActionRow.create(interaction, {})
                ),
        ];

        // Sending reply message
        interaction.reply(reply);
    },
};
