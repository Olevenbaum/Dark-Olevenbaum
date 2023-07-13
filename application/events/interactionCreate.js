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
const interactionTypesPath = path.join(__dirname, "./interactions");
const interactionTypeFiles = fs
    .readdirSync(interactionTypesPath)
    .filter((file) => file.endsWith(".js"));
interactionTypeFiles.forEach((interactionTypeFile) => {
    const interactionType = require(path.join(
        interactionTypesPath,
        interactionTypeFile
    ));
    interactionTypes.set(interactionType.type, interactionType);
});

module.exports = {
    // Setting event kind and type
    once: false,
    type: Events.InteractionCreate,

    // Handling event
    async execute(interaction) {
        // Checking if interaction was from bot user
        if (interaction.user.bot) {
            // Replying to interaction
            interaction.reply(
                `Bots are not allowed to use any features of ${userMention(
                    interaction.client.user.id
                )}`
            );
        } else {
            // Checking for blocked users
            if (blockedUsers.includes(interaction.user.id)) {
                // Replying to interaction
                interaction.reply({
                    content: `You are currently blocked and cannot use any features of ${userMention(
                        interaction.client.user.id
                    )}`,
                    ephemeral: true,
                });
            } else {
                // Searching interaction type
                const interactionType = interactionTypes.get(interaction.type);

                // Checking if interaction type was found
                if (interactionType) {
                    // Trying to execute interaction type specific script
                    await interactionType.execute(interaction).catch((error) =>
                        // Printing error
                        console.error(
                            "[ERROR]".padEnd(consoleSpace),
                            ":",
                            error
                        )
                    );
                } else {
                    // Printing error
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);
                }
            }
        }
    },
};
