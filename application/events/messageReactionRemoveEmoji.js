// Importing classes
const { Events } = require("discord.js");

module.exports = {
    // Setting event name and kind
    name: Events.MessageReactionRemoveEmoji,
    once: false,

    // Handling event
    execute(client) {},
};
