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

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);

    const slashCommand = interaction.client.slashCommands.get(
        interaction.commandName
    );

    if (!slashCommand) {
        console.error(
            `No slashCommand matching ${interaction.commandName} was found.`
        );
        return;
    }

    try {
        await slashCommand.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content:
                    "There was an error while executing this slashCommand!",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content:
                    "There was an error while executing this slashCommand!",
                ephemeral: true,
            });
        }
    }
});

client.login(token);
