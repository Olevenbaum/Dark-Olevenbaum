const { REST, Routes } = require("discord.js");
const { appId, token } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");

const slashCommands = [];
const slashCommandsPath = path.join(__dirname, "slashCommands");
const slashCommandFiles = fs
    .readdirSync(slashCommandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of slashCommandFiles) {
    const slashCommand = require(`./slashCommands/${file}`);
    slashCommands.push(slashCommand.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log(
            `Started refreshing ${slashCommands.length} application (/) slashCommands.`
        );

        const data = await rest.put(Routes.applicationCommands(appId), {
            body: slashCommands,
        });

        console.log(
            `Successfully reloaded ${data.length} application (/) slashCommands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
