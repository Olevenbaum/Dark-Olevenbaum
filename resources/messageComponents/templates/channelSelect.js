// Importing classes and methods
const { ChannelSelectMenuBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type name
    name: "",
    type: ComponentType.ChannelSelect,

    // Creating message component
    create(interaction) {
        return new ChannelSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
