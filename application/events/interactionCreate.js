// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes
const { Events, Collection } = require("discord.js");

// Reading interaction types
const interactionTypes = new Collection();
const interactionsPath = path.join(__dirname, "./interactions");
const interactionFiles = fs
    .readdirSync(interactionsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of interactionFiles) {
    const interactionType = require(path.join(interactionsPath, file));
    interactionTypes.set(interactionType.name, interactionType);
}

module.exports = {
    // Handling event
    async execute(interaction) {
        // Executing interaction type specific script
        await interactionTypes.get(interaction.type).execute(interaction);
    },

    // Setting event name and kind
    name: Events.InteractionCreate,
    once: false,
};
