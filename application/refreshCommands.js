// Importing classes and methods
const { Routes } = require("discord.js");

// Creating array for unregistered and changed commands
const unregisteredCommands = [];
const changedCommands = [];

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

module.exports = async (client) => {
    // Reading registered commands
    const registeredCommands = await client.application.commands.fetch();

    // Checking for new or changed commands to be registered or updated
    client.commands.forEach((command, commandName) => {
        const registeredCommand = registeredCommands.find(
            (registeredCommand) => registeredCommand.name === commandName
        );
        if (!registeredCommand) {
            unregisteredCommands.push(command.data.toJSON());
        } else if (registeredCommand !== command) {
            changedCommands.push(command.data.toJSON());
        }
    });

    // Registering new commands
    unregisteredCommands
        .forEach(async (unregisteredCommand) => {
            await client.rest
                .post(Routes.applicationCommand(application.applicationId), {
                    body: unregisteredCommand,
                })
                .then(
                    console.info(
                        "[INFORMATION]".padEnd(consoleSpace),
                        ":",
                        `Successfully registered new application command ${unregisteredCommand.name}`
                    )
                )
                .catch((error) => {
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);
                });
        })
        .then(
            console.info(
                "[INFORMATION]".padEnd(consoleSpace),
                ":",
                `Successfully registered all new application commands`
            )
        );

    // Updating changed commands
    changedCommands
        .forEach(async (changedCommand) => {
            await client.rest
                .patch(Routes.applicationCommand(application.applicationId), {
                    body: changedCommand,
                })
                .then(
                    console.info(
                        "[INFORMATION]".padEnd(consoleSpace),
                        ":",
                        `Successfully updated application command ${changedCommand.name}`
                    )
                )
                .catch((error) => {
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);
                });
        })
        .then(
            console.info(
                "[INFORMATION]".padEnd(consoleSpace),
                ":",
                `Successfully updated all new application commands`
            )
        );

    // Unregistering commands that have been deleted
    registeredCommands.forEach(async (command, commandId) => {
        if (!client.commands.has(command.name)) {
            const commandName = command.name;
            await client.rest
                .delete(
                    Routes.applicationCommand(
                        application.applicationId,
                        commandId
                    )
                )
                .then(
                    console.info(
                        "[INFORMATION]".padEnd(consoleSpace),
                        ":",
                        `Successfully deleted application command ${commandName}`
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
        `Successfully refreshed all application commands`
    );
};
