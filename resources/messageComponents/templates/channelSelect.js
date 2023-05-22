// Importing classes and methods
const { ChannelSelectMenuBuilder, ComponentType } = require("discord.js");

module.exports = {
    // Setting interaction type and name
    name: "",
    type: ComponentType.ChannelSelect,

    // Creating message component
    create(interaction, options = {}) {
        return new ChannelSelectMenuBuilder().setCustomId(this.name);
    },

    // Handling interaction
    async execute(interaction) {},
};
