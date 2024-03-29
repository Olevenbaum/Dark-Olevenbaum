// Importing classes and methods
const {
    ApplicationCommandOptionType,
    Collection,
    Routes,
} = require("discord.js");

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

    // Adding application command type to saved application command data
    savedApplicationCommand.data["type"] = savedApplicationCommand.type;

    // Searching and sorting common keys
    const commonKeys = Object.keys(savedApplicationCommand.data)
        .filter((key) => key in registeredApplicationCommand)
        .sort();

    // Overwriting registered application command
    registeredApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            // Checking for specific keys
            switch (key) {
                case "description_localizations" || "name_localizations":
                    // Defining entry
                    const entry = registeredApplicationCommand[key];

                    // Searching and sorting keys of entry
                    const keys = Object.keys(entry).sort();

                    // Returning sorted entry
                    return [
                        key,
                        Object.fromEntries(
                            keys.map((key) => [key, entry[key]])
                        ),
                    ];

                case "options":
                    // Transforming application command options
                    return transformApplicationCommandOptions(
                        registeredApplicationCommand[key],
                        true
                    );

                default:
                    // Returning entry
                    return [key, registeredApplicationCommand[key]];
            }
        })
    );

    // Overwriting saved application command
    savedApplicationCommand = Object.fromEntries(
        commonKeys.map((key) => {
            // Checking for specific keys
            switch (key) {
                case "description_localizations" || "name_localizations":
                    // Defining entry
                    const entry = savedApplicationCommand.data[key];

                    // Searching and sorting keys of entry
                    const keys = Object.keys(entry).sort();

                    // Returning sorted entry
                    return [
                        key,
                        Object.fromEntries(
                            keys.map((key) => [key, entry[key]])
                        ),
                    ];

                case "options":
                    // Transforming application command options
                    return transformApplicationCommandOptions(
                        savedApplicationCommand.data[key]
                    );

                default:
                    // Returning entry
                    return [
                        key,
                        savedApplicationCommand.data[key] ?? defaultValues[key],
                    ];
            }
        })
    );

    // Returning comparison
    return (
        JSON.stringify(registeredApplicationCommand) ===
        JSON.stringify(savedApplicationCommand)
    );
};

// Defining function for transforming application command options
const transformApplicationCommandOptions = function (
    applicationCommandOptions,
    registered = false
) {
    // Defining default option values
    const defaultOptionValues = { required: false };

    // Returning edited options
    return [
        "options",
        applicationCommandOptions.map((option) => {
            // Searching keys of option
            const keys = Object.keys(option).filter(
                (key) => typeof option[key] !== "undefined"
            );

            // Checking for option type
            if (option.type > 2) {
                // Iterating over keys of default option values
                Object.keys(defaultOptionValues).forEach((key) => {
                    // Checking for key in keys
                    if (!keys.includes(key)) {
                        // Adding default option value to keys
                        keys.push(key);
                    }
                });
            }

            // Checking if option contains type
            if (!keys.includes("type")) {
                // Adding type to keys
                keys.push("type");
            }

            // Sorting keys
            keys.sort();

            // Returning sorted option
            return Object.fromEntries(
                keys.map((key) => {
                    // Checking for specific keys
                    switch (key) {
                        case "channel_types":
                            // Returning sorted entry
                            return [key, option[key].sort()];

                        case "choices":
                            // Returning edited entry
                            return [
                                key,
                                option[key].map((choice) => {
                                    // Searching and sorting keys of choice
                                    const keys = Object.keys(choice).sort();

                                    // Returning sorted choices
                                    return Object.fromEntries(
                                        keys.map((key) => {
                                            // Checking for specific key
                                            switch (key) {
                                                case "name_localization":
                                                    // Defining entry
                                                    const entry = choice[key];

                                                    // Searching and sorting keys of entry
                                                    const keys =
                                                        Object.keys(
                                                            entry
                                                        ).sort();

                                                    // Returning sorted entry
                                                    return [
                                                        key,
                                                        Object.fromEntries(
                                                            keys.map((key) => [
                                                                key,
                                                                entry[key],
                                                            ])
                                                        ),
                                                    ];

                                                default:
                                                    // Returning entry
                                                    return [key, choice[key]];
                                            }
                                        })
                                    );
                                }),
                            ];

                        case "description_localizations" ||
                            "name_localizations":
                            // Defining entry
                            const entry = option[key];

                            // Searching and sorting keys of entry
                            const keys = Object.keys(entry).sort();

                            // Returning sorted entry
                            return [
                                key,
                                Object.fromEntries(
                                    keys.map((key) => [key, entry[key]])
                                ),
                            ];

                        case "options":
                            // Transform options
                            return transformApplicationCommandOptions(
                                option[key],
                                registered
                            );

                        case "type":
                            // Checking for value of type
                            if (option[key]) {
                                return [key, option[key]];
                            } else {
                                // Checking if any option has options
                                if (Object.keys(option).includes("options")) {
                                    // Checking if any option has type
                                    if (
                                        option["options"].some((option) =>
                                            Object.keys(option).includes(key)
                                        )
                                    ) {
                                        return [
                                            key,
                                            ApplicationCommandOptionType.Subcommand,
                                        ];
                                    } else {
                                        return [
                                            key,
                                            ApplicationCommandOptionType.SubcommandGroup,
                                        ];
                                    }
                                } else {
                                    return [
                                        key,
                                        ApplicationCommandOptionType.Subcommand,
                                    ];
                                }
                            }

                        default:
                            // Returning entry
                            return [
                                key,
                                option[key] ?? defaultOptionValues[key],
                            ];
                    }
                })
            );
        }),
    ];
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
            } else if (
                !compareApplicationCommands(
                    registeredApplicationCommand,
                    savedApplicationCommand
                )
            ) {
                // Adding request for application command update to promises
                promises.push(
                    client.rest
                        .patch(
                            Routes.applicationCommand(
                                client.application.id,
                                registeredApplicationCommand.id
                            ),
                            {
                                body: savedApplicationCommand,
                            }
                        )
                        .then(
                            // Printing information
                            console.info(
                                "[INFORMATION]".padEnd(consoleSpace),
                                ":",
                                `Successfully updated application command ${savedApplicationCommandName}`
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
