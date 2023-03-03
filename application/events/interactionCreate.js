const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        console.log(interaction);

        const slashCommand = interaction.client.slashCommands.get(
            interaction.commandName
        );

        if (!slashCommand) {
            console.error(
                `No slashCommand matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await slashCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content:
                        "There was an error while executing this slashCommand!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content:
                        "There was an error while executing this slashCommand!",
                    ephemeral: true,
                });
            }
        }
    },
};
