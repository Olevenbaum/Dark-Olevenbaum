// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Events, Collection, userMention } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../configuration.json");

// Importing blocked users
const blockedUsers = require("../../resources/blockedUsers.json");

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
    // Setting event name and kind
    name: Events.InteractionCreate,
    once: false,

    // Handling event
    async execute(interaction) {
        // Checking for bot interaction
        if (interaction.user.bot) {
            interaction.reply(
                `Bots are not allowed to use any commands of ${userMention(
                    interaction.client.user.id
                )}`
            );
        }

        // Checking for blocked users
        if (blockedUsers.includes(interaction.user.id)) {
            interaction.reply({
                content: `You are currently blocked and cannot use any features of ${userMention(
                    interaction.client.user.id
                )}`,
                ephemeral: true,
            });
        }

        // Executing interaction type specific script
        await interactionTypes
            .get(interaction.type)
            .execute(interaction)
            .catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );
    },
};
