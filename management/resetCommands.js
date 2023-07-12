// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { REST, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Defining prototype functions
Array.prototype.asynchronousFind = async function (predicate, thisArg = null) {
    // Binding second argument to callback function
    const boundPredicate = predicate.bind(thisArg);

    // Iteracting over keys of array
    for (const key of this.keys()) {
        // Checking if callback function returns true for element
        if (await boundPredicate(this.at(key), key, this)) {
            // Return element
            return this.at(key);
        }
    }

    // Return undefined
    return undefined;
};

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

// Searching for argument of process
const tokenArgument = process.argv.findIndex((argument) =>
    argument.startsWith("-token")
);

// Defining tokens array
const tokens = applications.map((application) => application.token);

// Checking if argument for different token was provided
if (tokenArgument && !isNaN(process.argv.at(tokenArgument + 1))) {
    tokens.rotate(process.argv.at(tokenArgument + 1));
}

// Iterating over application tokens
tokens.asynchronousFind(async (token) => {
    // Checking if token could be valid
    if (token && typeof token === "string" && token.length > 0) {
        // Trying to login rest application
        const rest = new REST().setToken(token);
        return await rest
            .put(Routes.applicationCommands(application.applicationId), {
                body: applicationCommands,
            })
            .catch((error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            });
    } else {
        // Printing warning
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            "Token does not fit a valid form"
        );

        // Returning false
        return false;
    }
});

// Printing information
console.info(
    "[INFORMATION]".padEnd(consoleSpace),
    ":",
    "Successfully reloaded all application commands."
);
