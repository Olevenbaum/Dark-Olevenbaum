// Importing classes
const { Routes } = require("discord.js");

// Creating array for new unregistered slash commands
const newSlashCommands = [];

// Importing configuration data
const { application } = require("../configuration.json");

module.exports = async (client) => {
    // Reading registered slashCommands
    const registeredSlashCommands = await client.application.commands.fetch();

    // Checking for new slashCommands to be registered
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

    // Registering new slashCommands
    if (newSlashCommands.length !== 0) {
        console.info(
            "[INFORMATION]".padEnd(15),
            ": ",
            `Started refreshing ${newSlashCommands.length} application slash commands.`
        );

        await client.rest
            .patch(Routes.applicationCommands(application.applicationID), {
                body: newSlashCommands,
            })
            .then(
                console.info(
                    "[INFORMATION]".padEnd(15),
                    ": ",
                    `Successfully reloaded new application slash commands`
                )
            )
            .catch((error) => {
                console.error("[ERROR]".padEnd(15), ": ", error);
            });
    }

    // Unregistering slashCommands that have been deleted
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
                        "[INFORMATION]".padEnd(15),
                        ": ",
                        `Successfully deleted application slash command ${slashCommandName}`
                    )
                )
                .catch((error) => {
                    console.error("[ERROR]".padEnd(15), ":", error);
                });
        }
    });

    console.info(
        "[INFORMATION]".padEnd(15),
        ": ",
        `Successfully refreshed all application slash commands`
    );
};
