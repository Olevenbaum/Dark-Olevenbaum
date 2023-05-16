// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

// Reading message component types
const applicationCommandTypes = new Collection();
const applicationCommandsPath = path.join(__dirname, "./applicationCommands");
const applicationCommandFiles = fs
    .readdirSync(applicationCommandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of applicationCommandFiles) {
    const applicationCommandType = require(path.join(
        applicationCommandsPath,
        file
    ));
    applicationCommandTypes.set(
        applicationCommandType.name,
        applicationCommandType
    );
}
module.exports = {
    // Setting interaction type and name
    name: InteractionType.ApplicationCommand,

    // Handling interaction
    async execute(interaction) {
        // Executing interaction type specific script
        await applicationCommandTypes
            .get(interaction.commandType)
            .execute(interaction)
            .catch((error) =>
                console.error("[ERROR]".padEnd(consoleSpace), ":", error)
            );
    },
};
