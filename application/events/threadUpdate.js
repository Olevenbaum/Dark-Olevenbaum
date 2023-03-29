// Importing classes
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.ThreadUpdate,
    once: false,

    // Handling event
    execute(client) {},
};
