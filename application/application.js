// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes and methods
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Sequelize } = require("sequelize");

// Importing configuration data
const {
    application,
    consoleSpace,
    database,
} = require("../configuration.json");

// Defining method for rotating arrays
Array.prototype.rotate = function (counter = 1, reverse = false) {
    counter %= this.length;
    if (reverse) {
        this.push(...this.splice(0, this.length - counter));
    } else {
        this.unshift(...this.splice(counter, this.length));
    }
    return this;
};

// Creating new client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
});

// Initializing database
if (database) {
    client.sequelize = new Sequelize(database);
}

// Creating individual collections
// sessions collection
client.sessions = new Collection();
// players collection
client.players = new Collection();

// Creating commands collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "../resources/commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((commandFile) => commandFile.endsWith(".js"));
commandFiles.forEach((commandFile) => {
    const command = require(path.join(commandsPath, commandFile));
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'data' or 'execute' property of command ${command.data.name}`
        );
    }
});

// Creating message components collections
client.messageComponents = new Collection();
const messageComponentsPath = path.join(
    __dirname,
    "../resources/messageComponents"
);
const messageComponentFiles = fs
    .readdirSync(messageComponentsPath)
    .filter((messageComponentFile) => messageComponentFile.endsWith(".js"));
messageComponentFiles.forEach((messageComponentFile) => {
    const messageComponent = require(path.join(
        messageComponentsPath,
        messageComponentFile
    ));
    if (
        "create" in messageComponent &&
        "execute" in messageComponent &&
        "name" in messageComponent &&
        "type" in messageComponent
    ) {
        client.messageComponents.set(messageComponent.name, messageComponent);
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'create', 'execute', 'name' or 'type' property of message component ${messageComponent.name}`
        );
    }
});

// Creating modals collection
client.modals = new Collection();
const modalsPath = path.join(__dirname, "../resources/modals");
const modalFiles = fs
    .readdirSync(modalsPath)
    .filter((modalFile) => modalFile.endsWith(".js"));
modalFiles.forEach((modalFile) => {
    const modal = require(path.join(modalsPath, modalFile));
    if (
        "create" in modal &&
        "execute" in modal &&
        "messageComponents" in modal &&
        "name" in modal
    ) {
        client.modals.set(modal.name, modal);
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'creat', 'execute', 'messageComponents' or 'name' property of message component ${messageComponent.name}`
        );
    }
});

// Creating event listener
const eventsPath = path.join(__dirname, "./events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((eventFile) => eventFile.endsWith(".js"));
for (const eventFile of eventFiles) {
    const event = require(path.join(eventsPath, eventFile));
    if ("execute" in event) {
        if (event.once) {
            client.once(event.type, (...args) => event.execute(...args));
        } else {
            client.on(event.type, (...args) => event.execute(...args));
        }
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Missing required 'execute' property of event ${event.type}`
        );
    }
}

// TODO: Fixing multiple token feature

// Reading argument of process to choose token
const argumentIndex = process.argv.findIndex((argument) =>
    argument.startsWith("-token")
);
console.log(process.argv);
let tokenIndex;
if (argumentIndex >= 0) {
    const arguments = process.argv.splice(argumentIndex, 2);
    const argument = arguments[1];
    let tokenIndex = argument ? parseInt(argument) : 0;
    if (tokenIndex < 0 || tokenIndex >= application.tokens.length) {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Index ${tokenIndex} cannot be found in array with length ${application.tokens.length}`
        );
        tokenIndex = undefined;
    }
}

// Logging in application with valid token
application.tokens.rotate(tokenIndex ?? 0).every(async (token) => {
    let success = true;
    await client.login(token).catch(() => {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `Invalid token provided, trying again with next token`
        );
        success = false;
    });
    return success;
});
