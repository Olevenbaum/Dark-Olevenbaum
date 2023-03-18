// Importing modules
const fs = require("node:fs");
const path = require("node:path");

// Importing classes
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

// Creating slash commands collection
client.slashCommands = new Collection();
const slashCommandsPath = path.join(__dirname, "./slashCommands");
const slashCommandFiles = fs
    .readdirSync(slashCommandsPath)
    .filter((slashCommandFile) => slashCommandFile.endsWith(".js"));
for (const slashCommandFile of slashCommandFiles) {
    const slashCommand = require(path.join(
        slashCommandsPath,
        slashCommandFile
    ));
    if ("data" in slashCommand && "execute" in slashCommand) {
        client.slashCommands.set(slashCommand.data.name, slashCommand);
    } else {
        console.warn(
            "[WARNING]".padEnd(consoleSpace),
            ":",
            `The slash command ${slashCommand.data.name} is missing a required 'data' or 'execute' property.`
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
