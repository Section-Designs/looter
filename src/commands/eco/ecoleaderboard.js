const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const UserBalance = require ('../../models/ecodatabase') // Adjust path as necessary

// Connect to MongoDB (replace the URL with your actual MongoDB URI)
module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the economy leaderboard.'),
    /**
     *
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        try {
            // Fetch top 10 users ordered by balance
            const sortedBalances = await UserBalance.find()
                .sort({ balance: -1 })
                .limit(10);

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
                    `${index + 1}. <@${user.userId}> - $${user.balance}`
                ).join('\n');

                embed.setDescription(leaderboardText);
            }

            // Reply with the embed message
            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            return interaction.reply({ content: 'There was an error fetching the leaderboard data.', ephemeral: true });
        }
    },
};
