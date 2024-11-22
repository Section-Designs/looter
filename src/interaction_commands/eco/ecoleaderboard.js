const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define the path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Attempt to read the file, handling any errors
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data.trim() ? JSON.parse(data) : []; // Initialize to an empty array if data is empty
    } catch (error) {
        console.error('Error parsing balances.json:', error);
        userBalances = []; // Use an empty array as a fallback
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Displays the economy leaderboard.'),
      /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        // Sort user balances in descending order
        const sortedBalances = userBalances
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 10); // Get top 10 users

        // Create an embed to display the leaderboard
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('Economy Leaderboard')
            .setFooter({
                text: 'Looter Bot',
                iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
            });

        // Check if there are no users in the leaderboard
        if (sortedBalances.length === 0) {
            embed.setDescription('No users found in the leaderboard.');
        } else {
            const leaderboardText = sortedBalances.map((user, index) => 
                `${index + 1}. <@${user.id}> - $${user.balance}`
            ).join('\n');

            embed.setDescription(leaderboardText);
        }

        // Reply with the embed message
        return interaction.reply({ embeds: [embed] });
    },
};
