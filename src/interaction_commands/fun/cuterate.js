const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cuterate')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Rates how cute a user is.')
        .addUserOption(option => 
            option.setName('user').setDescription('Select a user to rate')
        ),
      /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        // Get the user to rate, defaulting to the command invoker if none is selected
        const user = interaction.options.getUser('user') || interaction.user;
        
        // Generate a random decimal cute rate between 0 and 100
        const cuteRate = (Math.random() * 100).toFixed(1);

        // Determine emoji based on cuteRate
        let emoji;
        if (cuteRate < 25) {
            emoji = '😒'; // Not cute
        } else if (cuteRate < 50) {
            emoji = '😊'; // Slightly cute
        } else if (cuteRate < 75) {
            emoji = '🥰'; // Cute
        } else if (cuteRate < 90) {
            emoji = '😍'; // Very cute
        } else {
            emoji = '🌟'; // Super cute
        }

        // Create an embed for the response
        const embed = new EmbedBuilder()
            .setTitle('Cute Rate')
            .setDescription(`${user.username} is **${cuteRate}%** cute! ${emoji}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true })) // Set the user's avatar as the thumbnail
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }) // Use object for footer
            .setColor('#FF69B4'); // Set the embed color

        // Reply to the interaction with the embed
        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};
