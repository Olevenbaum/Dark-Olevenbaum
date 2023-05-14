// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Defining method for rotating arrays
Array.prototype.rotate = function (counter, reverse) {
    counter %= this.length;
    if (reverse) {
        this.push(...this.splice(0, this.length - counter));
    } else {
        this.unshift(...this.splice(counter, this.length));
    }
    return this;
};

// Creating array with all commands
const commands = [];
const commandsPath = path.join(__dirname, "../resources/commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    commands.push(require(path.join(commandsPath, file)).data.toJSON());
}

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
        body: commands,
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

console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    "Successfully reloaded all application commands."
);
