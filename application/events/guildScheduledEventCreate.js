// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.GuildScheduledEventCreate,

    // Handling event
    execute(client) {},
};
