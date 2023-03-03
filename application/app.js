const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.slashCommands = new Collection();
const slashCommandsPath = path.join(__dirname, "slashCommands");
const slashCommandFiles = fs
    .readdirSync(slashCommandsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of slashCommandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const slashCommand = require(filePath);
    if (
        "data" in slashCommand &&
        "execute" in slashCommand &&
        slashCommand.data.name != "" &&
        slashCommand.data.description != ""
    ) {
        client.slashCommands.set(slashCommand.data.name, slashCommand);
    } else {
        console.log(
            `[WARNING] The slashCommand at ${filePath} is missing a required 'data' or 'execute' property.`
        );
    }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(token);
