const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Make the bot say something.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message for the bot to say')
                .setRequired(true)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const message = interaction.options.getString('message');
        await interaction.channel.send({
            content: message
        })

        await interaction.reply({
            content: "sent",
            ephemeral: true
        })
    },
};
