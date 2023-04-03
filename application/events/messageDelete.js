// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.MessageDelete,
    once: false,

    // Handling event
    execute(client) {},
};
