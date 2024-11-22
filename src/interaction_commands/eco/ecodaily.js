const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Daily reward amount
const DAILY_REWARD = 1000;

// Load user balances from the file with error handling
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data.trim() ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error parsing balances.json in daily.js:', error);
        userBalances = [];
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Claim your daily coins reward!'),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.user;

        // Retrieve the user's balance and daily claim time
        let userBalance = userBalances.find(u => u.id === user.id);
        if (!userBalance) {
            userBalance = { id: user.id, balance: 0, lastDaily: 0 };
            userBalances.push(userBalance);
        }

        // Check if 24 hours have passed since last claim
        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (currentTime - userBalance.lastDaily < oneDay) {
            const hoursLeft = Math.floor((oneDay - (currentTime - userBalance.lastDaily)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor(((oneDay - (currentTime - userBalance.lastDaily)) % (1000 * 60 * 60)) / (1000 * 60));
            return interaction.reply({ content: `You've already claimed your daily reward! Please try again in **${hoursLeft}h ${minutesLeft}m**.`, ephemeral: true });
        }

        // Add the daily reward to the user's balance and update the lastDaily time
        userBalance.balance += DAILY_REWARD;
        userBalance.lastDaily = currentTime;

        // Save updated balances to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while updating your balance.', ephemeral: true });
        }

        // Create an embed to confirm the daily reward
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('💰 Daily Reward 💰')
            .setDescription(`You received **$${DAILY_REWARD}**!\nYour new balance is **$${userBalance.balance}**.`);

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
