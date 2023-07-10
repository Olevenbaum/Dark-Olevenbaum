// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Defining prototype functions
Array.prototype.rotate = function (counter = 1, reverse = false) {
    // Reducing counter
    counter %= this.length;

    // Checking if direction is reversed
    if (reverse) {
        // Rotating array clockwise
        this.push(...this.splice(0, this.length - counter));
    } else {
        // Rotating array counterclockwise
        this.unshift(...this.splice(counter, this.length));
    }

    // Returning array
    return this;
};

// Creating array for application commands
const applicationCommands = [];

// Defining application commands path
const applicationCommandsPath = path.join(
    __dirname,
    "../resources/applicationCommands"
);

// Reading application command filenames
const applicationCommandFiles = fs
    .readdirSync(applicationCommandsPath)
    .filter((file) => file.endsWith(".js"));

// Iteracting over application command files
applicationCommandFiles.forEach((applicationCommandFile) => {
    // Adding application command to its collection
    applicationCommands.push(
        require(path.join(
            applicationCommandsPath,
            applicationCommandFile
        )).data.toJSON()
    );
});

// TODO: Fixing multiple token feature

// Reading argument of process to choose token
const argumentIndex = process.argv.findIndex(
    (argument) => argument.startsWith("-") && !isNaN(argument.substring(1))
);
const argument = process.argv[argumentIndex];
let tokenIndex = argument ? parseInt(argument.substring(1)) : 0;
if (tokenIndex < 0 || tokenIndex >= application.tokens.length) {
    console.warn(
        "[WARNING]".padEnd(consoleSpace),
        ":",
        `Index ${tokenIndex} cannot be found in array with length ${application.tokens.length}`
    );
    tokenIndex = 0;
}

// Reloading all commands
for (let i = 0; i < application.tokens.length; i++) {
    let success = true;
    const token =
        tokenIndex + i >= application.tokens.length
            ? application.tokens[tokenIndex + i - application.tokens.length]
            : application.tokens[tokenIndex + i];
    const rest = new REST().setToken(token);
    rest.put(Routes.applicationCommands(application.applicationId), {
        body: applicationCommands,
    }).catch((error) => {
        console.error("[ERROR]".padEnd(consoleSpace), ":", error);
        if (error.code === "TokenInvalid") {
            if (i != application.tokens.length - 1) {
                console.warn(
                    "[WARNING]".padEnd(consoleSpace),
                    ":",
                    `Invalid provided, trying again with next token`
                );
            }
            success = false;
        }
    });
    if (success) {
        break;
    }
}

// Printing information
console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    "Successfully reloaded all application commands."
);
