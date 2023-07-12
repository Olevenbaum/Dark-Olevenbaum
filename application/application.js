// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Sequelize } = require("sequelize");

// Importing configuration data
const {
    applications,
    consoleSpace,
    database,
} = require("../configuration.json");

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

Array.prototype.shuffle = function () {
    // Loop for each index of array
    for (let currentIndex = this.length - 1; currentIndex > 0; currentIndex--) {
        // Determining random index

        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        // Swapping array element
        [this[currentIndex], this[randomIndex]] = [
            this[randomIndex],
            this[currentIndex],
        ];
    }

    // Returning array
    return this;
};

// Creating new client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

// Checking if database is enabled
if (database) {
    // Initializing database
    client.sequelize = new Sequelize(database);
}

// Creating individual collections
client.players = new Collection();
client.sessions = new Collection();

// Creating commands collection
client.applicationCommands = new Collection();

// Defining application commands path
const applicationCommandsPath = path.join(
    __dirname,
    "../resources/applicationCommands"
);

// Reading application command filenames
const applicationCommandFiles = fs
    .readdirSync(applicationCommandsPath)
    .filter((applicationCommandFile) => applicationCommandFile.endsWith(".js"));

// Iterate over all application command files
applicationCommandFiles.forEach((applicationCommandFile) => {
    // Reading application command
    const applicationCommand = require(path.join(
        applicationCommandsPath,
        applicationCommandFile
    ));

    // Checking for necessary parts of application command
    if ("data" in applicationCommand && "execute" in applicationCommand) {
        // Adding application command to its collection
        client.applicationCommands.set(
            applicationCommand.data.name,
            applicationCommand
        );
    } else {
        // Printing warning
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'data' or 'execute' property of command ${applicationCommand.data.name}`
        );
    }
});

// Creating message components collections
client.messageComponents = new Collection();

// Defining message components path
const messageComponentsPath = path.join(
    __dirname,
    "../resources/messageComponents"
);

// Reading message component filenames
const messageComponentFiles = fs
    .readdirSync(messageComponentsPath)
    .filter((messageComponentFile) => messageComponentFile.endsWith(".js"));

// Iterating over all message component files
messageComponentFiles.forEach((messageComponentFile) => {
    // Reading message component
    const messageComponent = require(path.join(
        messageComponentsPath,
        messageComponentFile
    ));

    // Checking for necessary parts of message component
    if (
        "create" in messageComponent &&
        "execute" in messageComponent &&
        "name" in messageComponent &&
        "type" in messageComponent
    ) {
        // Adding message component to its collection
        client.messageComponents.set(messageComponent.name, messageComponent);
    } else {
        // Printing warning
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'create', 'execute', 'name' or 'type' property of message component ${messageComponent.name}`
        );
    }
});

// Creating modals collection
client.modals = new Collection();

// Defining modals path
const modalsPath = path.join(__dirname, "../resources/modals");

// Reading modal filenames
const modalFiles = fs
    .readdirSync(modalsPath)
    .filter((modalFile) => modalFile.endsWith(".js"));

// Iterating over modal files
modalFiles.forEach((modalFile) => {
    // Reading modal
    const modal = require(path.join(modalsPath, modalFile));

    // Checking for necessary parts of modal
    if (
        "create" in modal &&
        "execute" in modal &&
        "messageComponents" in modal &&
        "name" in modal
    ) {
        // Adding modal to its collection
        client.modals.set(modal.name, modal);
    } else {
        // Printing warning
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'creat', 'execute', 'messageComponents' or 'name' property of message component ${messageComponent.name}`
        );
    }
});

// Defining events path
const eventsPath = path.join(__dirname, "./events");

// Reading event filenames
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((eventFile) => eventFile.endsWith(".js"));

// Iterate over event files
eventFiles.forEach((eventFile) => {
    // Reading event
    const event = require(path.join(eventsPath, eventFile));

    // Checking for necessary parts of event
    if ("execute" in event) {
        // Checking wheter event is called once
        if (event.once) {
            // Adding once eventlistener
            client.once(event.type, (...args) => event.execute(...args));
        } else {
            // Adding eventlistener
            client.on(event.type, (...args) => event.execute(...args));
        }
    } else {
        // Printing warning
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'execute' property of event ${event.type}`
        );
    }
});

// Searching for argument of process
const tokenArgument = process.argv.findIndex((argument) =>
    argument.startsWith("-application")
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
        // Trying to login application
        return await client.login(token).catch((error) => {
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
