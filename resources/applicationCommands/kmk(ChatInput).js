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
        .addSubcommand((subcommand) =>
            subcommand
                .addBooleanOption((option) =>
                    option
                        .setDescription(
                            "Specifies wheter you want to give three options or let the bot choose at random"
                        )
                        .setName("custom")
                )
                .addStringOption((option) =>
                    option
                        .setAutocomplete(true)
                        .setDescription(
                            "Specifies the category the celebrities should be chosen from (ignored for custom)"
                        )
                        .setName("category")
                )
                .addStringOption((option) =>
                    option
                        .setAutocomplete(true)
                        .setDescription(
                            "Specifies the gender the celebrities should be chosen from (ignored for custom)"
                        )
                        .setName("gender")
                )
                .setDescription(
                    "Starts a new game of Kiss Marry Kill with celebrities"
                )
                .setName("celebrities")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .addBooleanOption((option) =>
                    option
                        .setDescription(
                            "Specifies wheter you want to give three options or let the bot choose at random"
                        )
                        .setName("custom")
                )
                .addStringOption((option) =>
                    option
                        .setAutocomplete(true)
                        .setDescription(
                            "Specifies the gender the fictional characters should be chosen from (ignored for custom)"
                        )
                        .setName("gender")
                )
                .addStringOption((option) =>
                    option
                        .setAutocomplete(true)
                        .setDescription(
                            "Specifies the fandom the fictional characters should be chosen from (ignored for custom)"
                        )
                        .setName("fandom")
                )
                .setDescription(
                    "Starts a new game of Kiss Marry Kill with fictional characters"
                )
                .setName("fictional_characters")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .addBooleanOption((option) =>
                    option
                        .setDescription(
                            "Specifies wheter you want to give three options or let the bot choose at random"
                        )
                        .setName("custom")
                )
                .addChannelOption((option) =>
                    option
                        .setDescription(
                            "Specifies the channel the server members should to be chosen from (ignored for custom)"
                        )
                        .setName("channel")
                )
                .addRoleOption((option) =>
                    option
                        .setDescription(
                            "Specifies the role the server members should to be chosen from (ignored for custom)"
                        )
                        .setName("role")
                )
                .setDescription(
                    "Starts a new game of Kiss Marry Kill with server members"
                )
                .setName("server")
        )
        .setDescription("Starts a new game of Kiss Marry Kill")
        .setName("kmk"),
    type: ApplicationCommandType.ChatInput,

    // Handling command autocomplete
    async autocomplete(interaction) {
        // Reading subcommand name
        const subcommand = interaction.options.getSubcommand();

        // Reading focused option
        const option = interaction.options.getFocused(true);

        // Importing data
        const data = require(`../../database/constantData/kmk${
            subcommand.at(0).toUpperCase() +
            subcommand
                .slice(1)
                .replace(/(_\w)/g, (name) => name[1].toUpperCase())
        }.json`);

        // Defining key
        const key = option.name === "category" ? "categories" : option.name;

        // Defining choices counter
        const choicesCounter = {};

        // Iterating over data
        data.forEach((option) => {
            if (typeof option[key] === "string") {
                // Checking if key already exists
                if (choicesCounter[option[key]]) {
                    // Increasing counter
                    choicesCounter[option[key]]++;
                } else {
                    // Initializing counter
                    choicesCounter[option[key]] = 1;
                }
            } else {
                option[key].forEach((option) => {
                    // Checking if key already exists
                    if (choicesCounter[option]) {
                        // Increasing counter
                        choicesCounter[option]++;
                    } else {
                        // Initializing counter
                        choicesCounter[option] = 1;
                    }
                });
            }
        });

        // Sorting and filtering choices
        const choices = Object.keys(choicesCounter)
            .sort()
            .filter((key) => choicesCounter[key] >= 3);

        // Checking for option name
        if (option.name === "gender" && !choices.includes("Non-binary")) {
            // Adding non-binary option
            choices.push("Non-binary");
        }

        // Responding to interaction
        interaction.respond(
            choices
                .filter((choice) => choice.startsWith(option.value))
                .map((choice) => ({ name: choice, value: choice }))
                .splice(0, 25)
        );
    },

    // Handling command reponse
    async execute(interaction) {
        // Reading subcommand
        const subcommand = interaction.options.getSubcommand();

        // Reading shared option
        const custom = interaction.options.getBoolean("custom") ?? false;

        // Defining reply object
        const reply = {};

        // Variable for message components of reply
        const messageComponentNames = [];

        // Defining options
        const options = [];

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
            // Reading gender option
            const gender = interaction.options.getString("gender");

            // Editing subcommand specific reply
            switch (subcommand) {
                case "celebrities":
                    // Reading option values
                    const category = interaction.options.getString("category");

                    // Adding options
                    options.push(
                        ...require("../../database/constantData/kmkCelebrities.json")
                            .filter((celebrity) =>
                                category
                                    ? celebrity.categories.includes(category)
                                    : true
                            )
                            .filter((celebrity) =>
                                gender
                                    ? gender === "Non-binary"
                                        ? celebrity.gender !== "Female" &&
                                          celebrity.gender !== "Male"
                                        : celebrity.gender === gender
                                    : true
                            )
                            .map((celebrity) => celebrity.name)
                    );
                    break;

                case "fictional_characters":
                    // Reading option values
                    const fandom = interaction.options.getString("fandom");

                    // Adding options
                    options.push(
                        ...require("../../database/constantData/kmkFictionalCharacters.json")
                            .filter((fictionalCharacter) =>
                                fandom
                                    ? fictionalCharacter.fandom === fandom
                                    : true
                            )
                            .filter((fictionalCharacter) =>
                                gender
                                    ? gender === "Non-binary"
                                        ? fictionalCharacter.gender !==
                                              "Female" &&
                                          fictionalCharacter.gender !== "Male"
                                        : fictionalCharacter.gender === gender
                                    : true
                            )
                            .map(
                                (fictionalCharacter) => fictionalCharacter.name
                            )
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
                            subcommand === "server"
                                ? "members of this server"
                                : subcommand === "celebrities"
                                ? "celebrities"
                                : "fictional characters"
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
                    messageComponentNames.includes(
                        savedMessageComponent.name.replace(/\((.*?)\)/, "")
                    )
            )
            .map((savedActionRow) =>
                savedActionRow.create(interaction, {
                    kmkShowPicture1: {
                        disabled: subcommand === "server",
                        label: `Show ${options.at(0)}`,
                    },
                    kmkShowPicture2: {
                        disabled: subcommand === "server",
                        label: `Show ${options.at(1)}`,
                    },
                    kmkShowPicture3: {
                        disabled: subcommand === "server",
                        label: `Show ${options.at(2)}`,
                    },
                })
            );

        // Checking if modal is necessary
        if (subcommand !== "server" && custom) {
            // Showing modal to user
            interaction.showModal(
                interaction.client.modals
                    .find(
                        (modal) =>
                            modal.name.replace(/\((.*?)\)/, "") === "kmkCustom"
                    )
                    .create(interaction)
            );
        } else {
            // Sending reply message
            interaction.reply(reply);
        }
    },
};
