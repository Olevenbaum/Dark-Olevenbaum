// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

// Importing configuration data
const { consoleSpace } = require("../../../../configuration.json");

module.exports = {
    // Setting command type
    type: ApplicationCommandType.Message,

    // Handling interaction
    async execute(interaction) {
        // Searching for message command
        const messageCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if command was found
        if (messageCommand) {
            // Trying to execute message command specific script
            await messageCommand.execute(interaction).catch(async (error) => {
                // Printing error
                console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                // Checking if message command interaction was acknowledged
                if (interaction.replied || interaction.deferred) {
                    // Sending follow up message
                    interaction.followUp({
                        content:
                            "There was an error while executing this message command!",
                        ephemeral: true,
                    });
                }
            });
        } else {
            // Replying to interaction
            interaction.reply(
                `The message command ${interaction.commandName} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No message command matching ${interaction.commandName} was found`
            );
        }
    },
};
