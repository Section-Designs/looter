const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Load user balances from file with error handling
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data.trim() ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error parsing balances.json in roulette.js:', error);
        userBalances = [];
    }
}

// Helper function to randomly select the outcome of the spin
const spinRoulette = () => {
    const randomNumber = Math.floor(Math.random() * 38); // 0-37 for 38 numbers on a roulette wheel
    if (randomNumber === 0) return 'green';
    if (randomNumber % 2 === 0) return 'black';
    return 'red';
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roulette')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Bet on roulette and try to win coins!')
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Choose a color to bet on (red, black, or green)')
                .setRequired(true)
                .addChoices(
                    { name: 'Red', value: 'red' },
                    { name: 'Black', value: 'black' },
                    { name: 'Green', value: 'green' },
                ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of money to bet')
                .setRequired(true)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.user;
        const colorBet = interaction.options.getString('color');
        const betAmount = interaction.options.getInteger('amount');

        // Retrieve user balance or initialize a new balance entry if the user does not exist
        let userBalance = userBalances.find(u => u.id === user.id);
        if (!userBalance) {
            userBalance = { id: user.id, balance: 0 };
            userBalances.push(userBalance);
        }

        // Check if the user has enough balance to place the bet
        if (userBalance.balance < betAmount) {
            return interaction.reply({ content: `You don't have enough coins to place a **${betAmount}** coin bet. Your current balance is **${userBalance.balance}** coins.`, ephemeral: true });
        }

        // Perform the roulette spin
        const outcome = spinRoulette();

        // Calculate winnings based on the bet and outcome
        let winnings = 0;
        if (outcome === colorBet) {
            if (colorBet === 'green') {
                winnings = betAmount * 14; // 14x payout for green
            } else {
                winnings = betAmount * 2; // 2x payout for red or black
            }
            userBalance.balance += winnings;
        } else {
            userBalance.balance -= betAmount;
        }

        // Save updated balances to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while updating your balance.', ephemeral: true });
        }

        // Create an embed to display the result
        const embed = new EmbedBuilder()
            .setColor(outcome === colorBet ? '#FF69B4' : '#FF69B4')
            .setTitle('Roulette Results')
            .setDescription(
                `**Your bet:** ${colorBet} ($${betAmount})\n` +
                `**Outcome:** ${outcome}\n\n` +
                (outcome === colorBet
                    ? `🎉 Congratulations! You won $**${winnings}!**\n`
                    : `😢 Sorry, you lost $**${betAmount}**\n`) +
                `**Your new balance:** $${userBalance.balance}`
            );

        // Reply with the result embed
        return interaction.reply({ embeds: [embed] });
    },
};
