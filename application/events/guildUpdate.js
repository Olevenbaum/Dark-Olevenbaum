// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.GuildUpdate,
    once: false,

    // Handling event
    execute(client) {},
};
