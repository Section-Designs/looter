const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Load user balances from file with error handling for empty or malformed JSON
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data.trim() ? JSON.parse(data) : []; // Parse only if data is non-empty
    } catch (error) {
        console.error('Error parsing balances.json in work.js:', error);
        userBalances = []; // Fallback to an empty array if parsing fails
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Work to earn some money!'),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.user;
        
        // Calculate a random amount of money earned from "work"
        const earnings = Math.floor(Math.random() * 100) + 1; // Earn between 1 and 100

        // Check if the user has a balance entry
        let userBalance = userBalances.find(u => u.id === user.id);
        if (!userBalance) {
            userBalance = { id: user.id, balance: 0 };
            userBalances.push(userBalance);
        }

        // Add earnings to the user's balance
        userBalance.balance += earnings;

        // Save the updated balances
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while saving your balance.', ephemeral: true });
        }

        // Respond with an embed message showing the earnings
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(`You worked hard and earned **$${earnings}**! Your new balance is **$${userBalance.balance}**.`);

        return interaction.reply({ embeds: [embed] });
    },
};
