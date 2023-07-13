// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.MessageReactionAdd,

    // Handling event
    execute(client) {},
};
