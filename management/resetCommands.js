// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Creating REST manager
const rest = new REST().setToken(application.token);

// Creating array with all commands
let slashCommands = [];
const commandsPath = path.join(__dirname, "../resources/commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    slashCommands.push(require(path.join(commandsPath, file)).data.toJSON());
}

// Reloading all commands
console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    `Started refreshing ${commands.length} application commands.`
);
rest.put(Routes.applicationCommands(application.applicationID), {
    body: commands,
})
    .then(
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            "Successfully reloaded all application commands."
        )
    )
    .catch((error) => {
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
    });
