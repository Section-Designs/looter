const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setDescription('Get the banner of a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user whose banner you want to view.')
                .setRequired(false)
        ),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        // Get the user specified in the command, or default to the command user if no user is provided
        const targetUser = interaction.options.getUser('user') || interaction.user;

        // Fetch the full user object to get the banner (force: true ensures that we get all properties)
        const user = await interaction.client.users.fetch(targetUser.id, { force: true });

        // Get the user's banner URL (null if they don't have a banner)
        const bannerURL = user.bannerURL({ format: 'png', size: 4096 });

        // If the user doesn't have a banner, inform the user
        if (!bannerURL) {
            return interaction.reply({
                content: `${targetUser.username} does not have a banner set.`,
                ephemeral: true
            });
        }

        // Create an embed to display the user's banner
        const embed = new EmbedBuilder()
            .setTitle(`${targetUser.username}'s Banner`)
            .setImage(bannerURL)
            .setColor('#FF69B4')
            .setFooter({
                text: 'Looter Bot',
                iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
            });

        // Send the embed with the user's banner
        return interaction.reply({ embeds: [embed] });
    },
};
