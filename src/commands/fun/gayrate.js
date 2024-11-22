const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gayrate')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Rates how gay a user is.')
        .addUserOption(option => option.setName('user').setDescription('Select a user to rate')),
      /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        
        // Generate a random decimal gay rate between 0 and 100 with two decimal places
        const gayRate = (Math.random() * 100).toFixed(2);

        // Determine emoji based on gayRate
        let emoji;
        if (gayRate < 25) {
            emoji = '😐'; // Neutral for low percentages
        } else if (gayRate < 50) {
            emoji = '😊'; // Slightly positive for mid-low percentages
        } else if (gayRate < 75) {
            emoji = '🌈'; // Pride emoji for mid-high percentages
        } else if (gayRate < 90) {
            emoji = '🔥'; // Fire for high percentages
        } else {
            emoji = '💖'; // Sparkly heart for very high percentages
        }

        // Construct a response message
        const responseMessage = `${user.username} is **${gayRate}%** gay! ${emoji}`;
        
        // Reply to the interaction
        await interaction.reply({ content: responseMessage, ephemeral: false });
    },
};
