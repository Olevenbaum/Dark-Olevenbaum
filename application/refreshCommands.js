// Importing classes and methods
const { Collection, Routes } = require("discord.js");

// Importing configuration data
const { application, consoleSpace } = require("../configuration.json");

// Creating arrays for unregistered and changed commands
const unregisteredApplicationCommands = [];
const updatedApplicationCommands = new Collection();

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

    console.log(registeredCommands);
    console.log(client.applicationCommands);

    // Checking for new or changed commands to be registered or updated
    client.applicationCommands.forEach(
        (applicationCommand, applicationCommandName) => {
            const registeredCommand = registeredCommands.find(
                (registeredCommand) =>
                    registeredCommand.name === applicationCommandName
            );
            if (!registeredCommand) {
                unregisteredApplicationCommands.push(
                    applicationCommand.data.toJSON()
                );
            } else if (
                !compareCommands(registeredCommand, applicationCommand.data)
            ) {
                updatedApplicationCommands.set(
                    registeredCommand.id,
                    applicationCommand.data.toJSON()
                );
            }
        }
    );

    // Creating array for promises to be sent to Discord
    const promises = [];

    // Adding registration of new commands to promises
    unregisteredApplicationCommands.forEach(async (unregisteredCommand) => {
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
    updatedApplicationCommands.forEach(
        async (changedCommand, changedCommandId) => {
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
                        console.error(
                            "[ERROR]".padEnd(consoleSpace),
                            ":",
                            error
                        );
                    })
            );
        }
    );

    // Iteratingover all at Discord registered application commands
    registeredCommands.forEach(async (command, commandId) => {
        // Checking if application commmand still exists
        if (!client.applicationCommands.has(command.name)) {
            // Adding request for deletion of application command to promises
            promises.push(
                client.rest
                    .delete(
                        Routes.applicationCommand(
                            application.applicationId,
                            commandId
                        )
                    )
                    .then(
                        // Printing information
                        console.info(
                            "[INFORMATION]".padEnd(consoleSpace),
                            ":",
                            `Successfully deleted application command ${command.name}`
                        )
                    )
                    .catch((error) => {
                        // Printing error
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
        // Printing error
        console.error("[ERROR]".padEnd(consoleSpace), ":", error)
    );

    // Checking if any new commands were added or old commands deleted
    if (promises.length > 0) {
        // Printing information
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `Successfully refreshed all application commands`
        );
    } else {
        // Printing information
        console.info(
            "[INFORMATION]".padEnd(consoleSpace),
            ":",
            `No commands to be updated, deleted or added were found`
        );
    }
};
