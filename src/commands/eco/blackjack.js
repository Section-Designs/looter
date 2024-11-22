const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Balance = require ('../../models/ecodatabase') // Adjust path as needed

// MongoDB connection (ensure your MongoDB URI is correct)

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

        try {
            // Retrieve the user's balance from MongoDB
            let userBalance = await Balance.findOne({ userId: user.id });

            // If the user does not have a balance entry, create a new one with balance 0
            if (!userBalance) {
                userBalance = new Balance({ userId: user.id, balance: 0 });
                await userBalance.save();
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

            // Save the updated balance back to MongoDB
            await userBalance.save();

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

        } catch (error) {
            console.error('Error during blackjack game:', error);
            return interaction.reply({ content: 'There was an error while playing the game.', ephemeral: true });
        }
    },
};
