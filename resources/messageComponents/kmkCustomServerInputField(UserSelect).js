// Importing classes and methods
const {
    ComponentType,
    EmbedBuilder,
    userMention,
    UserSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    // Setting message components name and type
    name: "kmkCustomServerInputField(userSelect)",
    type: ComponentType.UserSelect,

    // Creating message component
    create(interaction, options) {
        return new UserSelectMenuBuilder()
            .setCustomId(this.name)
            .setDisabled(options.disabled ?? false)
            .setMaxValues(options.maximalValues ?? 3)
            .setMinValues(options.minimalValues ?? 3);
    },

    // Handling interaction
    async execute(interaction) {
        // Reading options
        const { members: options } = interaction;

        // Defining embed for reply message
        const embeds = [
            new EmbedBuilder()
                .setTitle("Kiss Marry Kill")
                .setDescription(
                    `You have to choose between: ${options
                        .map((member) => userMention(member.id))
                        .reduce(
                            (optionsString, option, index) =>
                                (optionsString +=
                                    index === options.length - 1
                                        ? ` and ${option}`
                                        : `, ${option}`)
                        )}`
                )
                .setFooter({
                    text: "Options chosen among custom server members!",
                }),
        ];

        // Defining components for reply message
        const components = [
            interaction.client.messageComponents
                .filter(
                    (savedMessageComponent) =>
                        savedMessageComponent.type === ComponentType.ActionRow
                )
                .find(
                    (savedActionRow) =>
                        savedActionRow.name.replace(/\((.*?)\)/, "") ===
                        "kmkManagement"
                )
                .create(interaction, {
                    kmkPicture1: {
                        disabled: true,
                        label: `Show ${
                            options.at(0).nickname ??
                            options.at(0).user.username
                        }`,
                    },
                    kmkPicture2: {
                        disabled: true,
                        label: `Show ${
                            options.at(1).nickname ??
                            options.at(1).user.username
                        }`,
                    },
                    kmkPicture3: {
                        disabled: true,
                        label: `Show ${
                            options.at(2).nickname ??
                            options.at(2).user.username
                        }`,
                    },
                }),
        ];

        // Replying to interaction
        interaction.reply({ components, embeds });
    },
};
