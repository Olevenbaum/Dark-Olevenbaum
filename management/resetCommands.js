// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Creating REST manager
const rest = new REST().setToken(application.token);

// Creating array with all slash commands
let slashCommands = [];
const slashCommandsPath = path.join(__dirname, "../resources/slashCommands");
const slashCommandFiles = fs
    .readdirSync(slashCommandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of slashCommandFiles) {
    slashCommands.push(
        require(path.join(slashCommandsPath, file)).data.toJSON()
    );
}

// Reloading all slash commands by deleting them first
console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    `Started refreshing ${slashCommands.length} application slash commands.`
);
rest.put(Routes.applicationCommands(application.applicationID), {
    body: slashCommands,
})
    .then(
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Successfully reloaded all application slash commands."
        )
    )
    .catch((error) => {
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
    });
