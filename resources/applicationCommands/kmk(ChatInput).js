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
                            "Specifies wheter you want to give three options or let the bot choose at random"
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
                            "Specifies wheter you want to give three options or let the bot choose at random"
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
            // Checking subcommand
            if (interaction.options.getSubcommand() === "server") {
                // Adding components
                messageComponentNames.push("kmkCustomServer");

                // Setting reply to ephemeral
                reply.ephemeral = true;
            }
        } else {
            // Defining options
            const options = [];

            // Editing subcommand specific reply
            switch (interaction.options.getSubcommand()) {
                case "celebrities":
                    // Reading option value
                    const category = interaction.options.getString("category");

                    // Adding options
                    options.push(
                        require("../../database/constantTables/kmkCelebrities.json")
                            .filter((celebrity) =>
                                category
                                    ? celebrity.categories.includes(category)
                                    : true
                            )
                            .map((celebrity) => `"${celebrity.name}"`)
                    );
                    break;
                case "server":
                    // Reading options values
                    const channel = interaction.options.getChannel("channel");
                    const role = interaction.options.getRole("role");

                    // Adding options
                    options.push(
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

            // Picking three random options
            options.shuffle();
            options.splice(3);

            // Defining embed for reply message
            reply.embeds = [
                new EmbedBuilder()
                    .setTitle("Kiss Marry Kill")
                    .setDescription(
                        `You have to choose between: ${options.reduce(
                            (optionsString, option, index) =>
                                (optionsString +=
                                    index === options.length - 1
                                        ? ` and ${option}`
                                        : `, ${option}`)
                        )}`
                    )
                    .setFooter({
                        text: `Options chosen among ${
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
        reply.components = interaction.client.messageComponents
            .filter(
                (savedMessageComponent) =>
                    savedMessageComponent.type === ComponentType.ActionRow &&
                    messageComponentNames.includes(savedMessageComponent.name)
            )
            .map((savedActionRow) => savedActionRow.create(interaction, {}));

        // Checking if modal is necessary
        if (interaction.options.getSubcommand() === "celebrities" && custom) {
            // Showing modal to user
            interaction.showModal(
                interaction.client.modals
                    .find((modal) => modal.name === "kmkCustomCelebrities")
                    .create(interaction)
            );
        } else {
            // Sending reply message
            interaction.reply(reply);
        }
    },
};
