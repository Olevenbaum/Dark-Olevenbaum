// Importing classes and methods
const { Collection, Routes } = require("discord.js");

// Creating array for unregistered and changed commands
const unregisteredCommands = [];
const changedCommands = new Collection();

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Defining method for replacing undefined with false
function replaceUndefined(command) {
    for (const [key, value] of Object.entries(command)) {
        if (typeof value === "undefined") {
            command[key] = false;
        }
    }
}

// Defining method for comparing command objects
function compareCommands(registeredCommand, command) {
    // Creating copy of unregistered command
    const commandCopy = Object.assign({}, command);
    // Creating copy of registered command
    const registeredCommandCopy = {};
    for (const key in commandCopy) {
        registeredCommandCopy[key] = registeredCommand[key];
    }

    // Replacing undefined values with false
    replaceUndefined(commandCopy);
    replaceUndefined(registeredCommandCopy);

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

    // Creating array for promises to be sent to Discord
    const promises = [];

    // Adding registration of new commands to promises
    unregisteredCommands.forEach(async (unregisteredCommand) => {
        promises.push(
            client.rest
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
                })
        );
    });

    // Adding update of changed commands to promises
    changedCommands.forEach(async (changedCommand, changedCommandId) => {
        promises.push(
            client.rest
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
                })
        );
    });

    // Added unregistering old commands that have been deleted tp promises
    registeredCommands.forEach(async (command, commandId) => {
        if (!client.commands.has(command.name)) {
            const commandName = command.name;
            promises.push(
                client.rest
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
                        console.error(
                            "[ERROR]".padEnd(consoleSpace),
                            ":",
                            error
                        );
                    })
            );
        }
    });

    // Executing promises
    await Promise.all(promises).catch((error) =>
        console.error("[ERROR]".padEnd(consoleSpace), ":", error)
    );

    if (promises.length > 0) {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Successfully refreshed all application commands`
        );
    } else {
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `No commands to be updated, deleted or added were found`
        );
    }
};
