// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.GuildScheduledEventDelete,
    once: false,

    // Handling event
    execute(client) {},
};
