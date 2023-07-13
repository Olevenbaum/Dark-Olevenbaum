// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.GuildMemberRemove,

    // Handling event
    execute(client) {},
};
