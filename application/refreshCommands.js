// Importing classes and methods
const { Collection, Routes } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../configuration.json");

// Defining function for comparison of registered and saved application commands
const compareApplicationCommands = function (
    registeredApplicationCommand,
    savedApplicationCommand
) {
    // Defining default values
    const defaultValues = {
        default_member_permissions: null,
        dm_permission: true,
        nsfw: false,
    };
    const defaultOptionValues = { required: false };

    // Adding application command type to saved application command data
    savedApplicationCommand.data["type"] = savedApplicationCommand.type;

    // Searching for common keys
    const commonKeys = Object.keys(savedApplicationCommand.data)
        .filter((key) => key in registeredApplicationCommand)
        .sort();

    // Overwriting registered application command
    registeredApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            if (
                key === "name_localizations" ||
                key === "description_localizations"
            ) {
            } else if (key === "option") {
                registeredApplicationCommand[key].map(
                    (option) => registeredApplicationCommand[key][option]
                );
            } else {
                return [
                    key,
                    registeredApplicationCommand[key] ?? defaultValues[key],
                ];
            }
        })
    );

    // Overwriting saved application command
    savedApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            return [
                key,
                savedApplicationCommand.data[key] ?? defaultValues[key],
            ];
        })
    );

    console.log(JSON.stringify(registeredApplicationCommand));
    console.log(JSON.stringify(savedApplicationCommand));

    // Returning comparison
    return (
        JSON.stringify(registeredApplicationCommand) ===
        JSON.stringify(savedApplicationCommand)
    );
};

module.exports = async (client) => {
    // Defining registered application commands collection
    const registeredApplicationCommands = new Collection();

    // Inserting registered application commands into their collection
    (
        await client.rest.get(Routes.applicationCommands(client.application.id))
    ).forEach((registeredApplicationCommand) =>
        registeredApplicationCommands.set(
            registeredApplicationCommand.name,
            registeredApplicationCommand
        )
    );

    // Creating array for requests to be sent to Discord
    const promises = [];

    // Iterating over application commands
    client.applicationCommands.each(
        (savedApplicationCommand, savedApplicationCommandName) => {
            // Searching for applicaiton command in registered application commands
            const registeredApplicationCommand =
                registeredApplicationCommands.get(savedApplicationCommandName);

            // Checking if application command is not registered
            if (!registeredApplicationCommand) {
                // Adding request for registration to promises
                promises.push(
                    client.rest
                        .post(
                            Routes.applicationCommands(client.application.id),
                            {
                                body: savedApplicationCommand,
                            }
                        )
                        .then(
                            console.info(
                                "[INFORMATION]".padEnd(consoleSpace),
                                ":",
                                `Successfully registered new application command ${savedApplicationCommandName}`
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
                // TODO: compare commands
            } else if (
                compareApplicationCommands(
                    registeredApplicationCommand,
                    savedApplicationCommand
                )
            ) {
                console.log("SUCCESS");
                // Adding request for application command update to promises
                promises.push();
            }
        }
    );

    // Iterating over registered application commands
    registeredApplicationCommands.each(
        (registeredApplicationCommand, registeredApplicationCommandName) => {
            // Checking if application commmand still exists
            if (
                !client.applicationCommands.has(
                    registeredApplicationCommandName
                )
            ) {
                // Adding request for deletion of application command to promises
                promises.push(
                    client.rest
                        .delete(
                            Routes.applicationCommand(
                                client.application.id,
                                registeredApplicationCommand.id
                            )
                        )
                        .then(
                            // Printing information
                            console.info(
                                "[INFORMATION]".padEnd(consoleSpace),
                                ":",
                                `Successfully deleted application command ${registeredApplicationCommandName}`
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
        }
    );

    // Executing promises
    await Promise.all(promises).catch((error) =>
        // Printing error
        console.error("[ERROR]".padEnd(consoleSpace), ":", error)
    );

    // Checking if any application commands were added, deleted or updated
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
