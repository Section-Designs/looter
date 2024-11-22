const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

// Load configuration if it exists
let config = {};
if (fs.existsSync('config.json')) {
    config = JSON.parse(fs.readFileSync('config.json'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setDescription('Displays the avatar of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose avatar you want to see.')
                .setRequired(false)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        try {
            // Get the user (default to the author if not specified)
            const user = interaction.options.getUser('user') || interaction.user;

            // Determine if the avatar is animated and get the correct avatar URL
            const avatarURL = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
            
            // Create an embed to show the avatar
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s Avatar`)
                .setImage(avatarURL)
                .setColor('#FF69B4');

            // Create buttons for downloading as JPEG, PNG, and GIF (if animated)
            const jpegButton = new ButtonBuilder()
                .setLabel('JPEG')
                .setStyle('Link')
                .setURL(user.displayAvatarURL({ format: 'jpeg', size: 1024 }));

            const pngButton = new ButtonBuilder()
                .setLabel('PNG')
                .setStyle('Link')
                .setURL(avatarURL);  // PNG is the default format already

            const webpButton = new ButtonBuilder()
                .setLabel('WEBP')
                .setStyle('Link')
                .setURL(user.displayAvatarURL({ format: 'webp', size: 1024 }));

            // Create an action row to hold the buttons
            const actionRow = new ActionRowBuilder()
                .addComponents(jpegButton, pngButton, webpButton);
            
            // Send the embed with the buttons
            await interaction.reply({ embeds: [embed], components: [actionRow] });

        } catch (error) {
            console.error('Error loading avatar:', error);
            await interaction.reply({ content: 'There was an error trying to fetch the avatar.', ephemeral: true });
        }
    }
};
