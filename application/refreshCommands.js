// Importing classes and methods
const { Collection, Routes } = require("discord.js");

// Creating array for unregistered and changed commands
const unregisteredCommands = [];
const changedCommands = new Collection();

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Defining method for comparing command objects
function compareCommands(registeredCommand, command) {
    const commandCopy = Object.assign({}, command);
    // Creating copy of registered command
    const registeredCommandCopy = {};
    for (const key in commandCopy) {
        registeredCommandCopy[key] = registeredCommand[key];
    }

    // Method for replacing undefined with false
    function replaceingUndefined(command) {
        for (const [key, value] of Object.entries(command)) {
            if (typeof value === "undefined") {
                command[key] = false;
            }
        }
    }

    replaceingUndefined(commandCopy);
    replaceingUndefined(registeredCommandCopy);

    // Comparing JSONs of commands
    const commandJSON = JSON.stringify(commandCopy);
    const registeredCommandJSON = JSON.stringify(registeredCommandCopy);
    return commandJSON == registeredCommandJSON;
}

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
        } else if (!compareCommands(registeredCommand, command.data)) {
            changedCommands.set(registeredCommand.id, command.data.toJSON());
        }
    });

    // Registering new commands
    unregisteredCommands.forEach(async (unregisteredCommand) => {
        await client.rest
            .post(Routes.applicationCommands(application.applicationId), {
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
    });

    // Updating changed commands
    changedCommands.forEach(async (changedCommand, changedCommandId) => {
        await client.rest
            .patch(
                Routes.applicationCommand(
                    application.applicationId,
                    changedCommandId
                ),
                {
                    body: changedCommand,
                }
            )
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
    });

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
