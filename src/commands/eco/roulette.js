const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const UserBalance = require ('../../models/ecodatabase') // Path to your UserBalance model

// Connect to MongoDB (replace this with your MongoDB URI)

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

        try {
            // Retrieve user balance or initialize a new balance entry if the user does not exist
            let userBalance = await UserBalance.findOne({ userId: user.id });

            if (!userBalance) {
                userBalance = new UserBalance({ userId: user.id, balance: 0 });
                await userBalance.save(); // Save the new user balance in the database
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

            // Save updated user balance to MongoDB
            await userBalance.save();

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

        } catch (error) {
            console.error('Error processing roulette bet:', error);
            return interaction.reply({ content: 'An error occurred while processing your bet. Please try again later.', ephemeral: true });
        }
    },
};
