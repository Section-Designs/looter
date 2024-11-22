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
        console.error('Error parsing balances.json in blackjack.js:', error);
        userBalances = [];
    }
}

// Function to deal a random card (value between 1 and 11)
const dealCard = () => Math.floor(Math.random() * 11) + 1;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Play a game of blackjack to win or lose coins.')
        .addIntegerOption(option =>
            option.setName('bet')
                .setDescription('Amount of money to bet')
                .setRequired(true)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.user;
        const bet = interaction.options.getInteger('bet');

        // Retrieve user balance or initialize a new balance entry if the user does not exist
        let userBalance = userBalances.find(u => u.id === user.id);
        if (!userBalance) {
            userBalance = { id: user.id, balance: 0 };
            userBalances.push(userBalance);
        }

        // Check if the user has enough balance to place the bet
        if (userBalance.balance < bet) {
            return interaction.reply({ content: `You don't have enough coins to place a **${bet}** coin bet. Your current balance is **${userBalance.balance}** coins.`, ephemeral: true });
        }

        // Start the blackjack game
        let playerHand = dealCard() + dealCard();
        let botHand = dealCard() + dealCard();
        
        const playBlackjack = () => {
            // Keep drawing until player hand is >= 17 and bot hand is >= 17
            while (playerHand < 17) playerHand += dealCard();
            while (botHand < 17) botHand += dealCard();

            // Determine game outcome
            if (playerHand > 21 || (botHand <= 21 && botHand > playerHand)) return 'lose';
            if (botHand > 21 || playerHand > botHand) return 'win';
            return 'tie';
        };

        const result = playBlackjack();

        // Update the balance based on the game outcome
        if (result === 'win') {
            userBalance.balance += bet;
        } else if (result === 'lose') {
            userBalance.balance -= bet;
        }

        // Save updated balances to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while updating your balance.', ephemeral: true });
        }

        // Create an embed to display the game result
        const embed = new EmbedBuilder()
            .setColor(result === 'win' ? '#FF69B4' : result === 'lose' ? '#FF69B4' : '#FF69B4')
            .setTitle('Blackjack Results')
            .setDescription(
                `**Your hand:** ${playerHand}\n**Bot's hand:** ${botHand}\n\n` +
                `**Result:** ${result === 'win' ? 'You won!' : result === 'lose' ? 'You lost!' : 'It\'s a tie!'}\n` +
                `**Your new balance:** $${userBalance.balance}`
            );

        // Reply with the result embed
        return interaction.reply({ embeds: [embed] });
    },
};
