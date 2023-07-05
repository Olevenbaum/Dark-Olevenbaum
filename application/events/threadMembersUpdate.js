// Importing classes and methods
const { Events } = require("discord.js");

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.ThreadMembersUpdate,

    // Handling event
    execute(client) {},
};
