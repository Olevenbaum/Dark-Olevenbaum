// Importing classes
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.PresenceUpdate,
    once: false,

    // Handling event
    execute(client) {},
};
