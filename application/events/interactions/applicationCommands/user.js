// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting command type
    type: ApplicationCommandType.User,

    // Handling interaction
    async execute(interaction) {
        // Searching for user command
        const userCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if user command was found
        if (userCommand) {
            // Trying to execute user command specific script
            await userCommand.execute(interaction).catch(async (error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if user command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this user command!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The user command ${interaction.commandName} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No user command matching ${interaction.commandName} was found`
            );
        }
    },
};
