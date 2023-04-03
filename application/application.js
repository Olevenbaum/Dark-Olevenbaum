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

// Creating new client
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Initializing database
client.sequelize = new Sequelize(
    database.name,
    database.username,
    database.password,
    {
        dialect: "sqlite",
        storage: "database.sqlite",
    }
);

// Creating commands collection
client.commands = new Collection();
const commandsPath = path.join(__dirname, "../resources/commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((commandFile) => commandFile.endsWith(".js"));
for (const commandFile of commandFiles) {
    const command = require(path.join(commandsPath, commandFile));
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `The command ${command.data.name} is missing a required 'data' or 'execute' property.`
        );
    }
}

// Creating event listener
const eventsPath = path.join(__dirname, "./events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((eventFile) => eventFile.endsWith(".js"));
for (const eventFile of eventFiles) {
    const event = require(path.join(eventsPath, eventFile));
    if ("execute" in event) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `The event ${event.name} is missing a required 'execute' property.`
        );
    }
}

// Logging in application
client.login(application.token);
