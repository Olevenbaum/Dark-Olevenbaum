// Importing classes and methods
const { ApplicationCommandType } = require("discord.js");

module.exports = {
    // Setting command type
    type: ApplicationCommandType,

    // Handling interaction
    async execute(interaction) {
        // Searching for application command
        const applicationCommand = interaction.client.applicationCommands
            .filter(
                (applicationCommand) => applicationCommand.type === this.type
            )
            .get(interaction.commandName);

        // Checking if application command was found
        if (applicationCommand) {
            // Trying to execute application command specific script
            await applicationCommand
                .execute(interaction)
                .catch(async (error) => {
                    // Printint error
                    console.error("[ERROR]".padEnd(consoleSpace), ":", error);

                    // Checking if application command interaction was acknowledged
                    if (interaction.replied || interaction.deferred) {
                        // Sending follow up message
                        interaction.followUp({
                            content:
                                "There was an error while executing this command!",
                            ephemeral: true,
                        });
                    }
                });
        } else {
            // Replying to interaction
            interaction.reply(
                `The command ${interaction.commandName} could not be found!`
            );

            // Printing error
            console.error(
                "[ERROR]".padEnd(consoleSpace),
                ":",
                `No command matching ${interaction.commandName} was found`
            );
        }
    },
};
