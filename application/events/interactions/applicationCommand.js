// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Collection, InteractionType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../configuration.json");

// Creating message component types collection
const applicationCommandTypes = new Collection();
const applicationCommandsPath = path.join(__dirname, "./applicationCommands");
const applicationCommandFiles = fs
    .readdirSync(applicationCommandsPath)
    .filter((file) => file.endsWith(".js"));
applicationCommandFiles.forEach((applicationCommandFile) => {
    const applicationCommandType = require(path.join(
        applicationCommandsPath,
        applicationCommandFile
    ));
    applicationCommandTypes.set(
        applicationCommandType.type,
        applicationCommandType
    );
});

module.exports = {
    // Setting interaction type
    type: InteractionType.ApplicationCommand,

    // Handling interaction
    async execute(interaction) {
        // Searching for application command type
        const applicationCommandType = applicationCommandTypes.get(
            interaction.commandType
        );

        // Checking if application command type was found
        if (applicationCommandType) {
            // Trying to execute application command type specific script
            await applicationCommandType.execute(interaction).catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            });
        } else {
            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No application command type matching ${interaction.commandType} was found`
            );
        }
    },
};
