// Importing classes
const { Routes } = require("discord.js");

// Creating array for new unregistered slash commands
const newSlashCommands = [];

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

module.exports = async (client) => {
    // Reading registered slash commands
    const registeredSlashCommands = await client.application.commands.fetch();

    // Checking for new slash commands to be registered
    client.slashCommands.forEach((slashCommand, slashCommandName) => {
        if (
            !registeredSlashCommands.some(
                (registeredSlashCommand) =>
                    slashCommandName === registeredSlashCommand.name
            )
        ) {
            newSlashCommands.push(slashCommand.data.toJSON());
        }
    });

    // Registering new slash commands
    if (newSlashCommands.length !== 0) {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Started refreshing ${newSlashCommands.length} application slash commands.`
        );

        await client.rest
            .patch(Routes.applicationCommands(application.applicationID), {
                body: newSlashCommands,
            })
            .then(
                console.info(
                    "[INFORMATION]".padEnd(consoleSpace),
                    ":",
                    `Successfully reloaded new application slash commands`
                )
            )
            .catch((error) => {
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);
            });
    }

    // Unregistering slash commands that have been deleted
    registeredSlashCommands.forEach(async (slashCommand, slashCommandID) => {
        if (!client.slashCommands.has(slashCommand.name)) {
            const slashCommandName = slashCommand.name;
            await client.rest
                .delete(
                    Routes.applicationCommand(
                        application.applicationID,
                        slashCommandID
                    )
                )
                .then(
                    console.info(
                        "[INFORMATION]".padEnd(consoleSpace),
                        ":",
                        `Successfully deleted application slash command ${slashCommandName}`
                    )
                )
                .catch((error) => {
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);
                });
        }
    });

    console.info(
        "[INFORMATION]".padEnd(consoleSpace),
        ":",
        `Successfully refreshed all application slash commands`
    );
};
