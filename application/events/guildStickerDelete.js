// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.GuildStickerDelete,

    // Handling event
    execute(client) {},
};
