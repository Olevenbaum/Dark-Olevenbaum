// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

// Reading message component types
const messageComponentTypes = new Collection();
const messageComponentsPath = path.join(__dirname, "./messageComponents");
const messageComponentFiles = fs
    .readdirSync(messageComponentsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of messageComponentFiles) {
    const messageComponentType = require(path.join(
        messageComponentsPath,
        file
    ));
    messageComponentTypes.set(messageComponentType.name, messageComponentType);
}

module.exports = {
    // Setting message component type name
    name: InteractionType.MessageComponent,

    // Handling interaction
    async execute(interaction) {
        // Executing interaction type specific script
        await messageComponentTypes
            .get(interaction.componentType)
            .execute(interaction)
            .catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );
    },
};
