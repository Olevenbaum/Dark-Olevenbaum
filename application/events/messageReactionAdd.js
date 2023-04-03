// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.MessageReactionAdd,
    once: false,

    // Handling event
    execute(client) {},
};
