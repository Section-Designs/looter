const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setDescription('Get help with bot commands'),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('**Looter Bot Help Menu**')
            .setDescription(
                'Here are some useful links to help you get started:\n\n' +
                '**Invite Looter Bot**: [Click here to invite the bot to your server](https://discord.com/oauth2/authorize?client_id=1246651181057445978&integration_type=1&scope=applications.commands)\n\n' +
                '**Support Server**: [Join the support server for assistance](https://discord.gg/MKkHYcDb5f)\n\n' +
                '**Miscellaneous Commands**: \n' +
                '- `/avatar`: Get someone\'s avatar.\n' +
                '- `/gayrate`: Rates how gay a user is.'
            )
            .setColor('#FF69B4');

        // Reply with the help embed
        await interaction.reply({ embeds: [helpEmbed], ephemeral: false });

    },
};