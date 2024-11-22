const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/ecodatabase'); // Import User model

// Define possible slot symbols and payouts
const symbols = ["🍒", "🍋", "🔔", "🍀", "💎", "7️⃣"];
const payouts = {
    "🍒": 2,
    "🍋": 3,
    "🔔": 5,
    "🍀": 8,
    "💎": 12,
    "7️⃣": 20
};

// Helper function to spin the slot machine
const spinSlots = () => [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Spin the slot machine and try to win big!')
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
        const betAmount = interaction.options.getInteger('amount');

        // Retrieve user balance from MongoDB
        let userBalance = await User.findOne({ id: user.id });
        
        // If the user does not exist in the database, create a new user
        if (!userBalance) {
            userBalance = new User({ id: user.id, balance: 0 });
            await userBalance.save();
        }

        // Check if the user has enough balance to place the bet
        if (userBalance.balance < betAmount) {
            return interaction.reply({ content: `You don't have enough coins to place a **${betAmount}** coin bet. Your current balance is **${userBalance.balance}** coins.`, ephemeral: true });
        }

        // Perform the slot spin
        const result = spinSlots();
        const [slot1, slot2, slot3] = result;
        let winnings = 0;

        // Check for matches and calculate winnings
        if (slot1 === slot2 && slot2 === slot3) {
            winnings = betAmount * payouts[slot1]; // Triple match
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            winnings = betAmount * 2; // Two symbols match, 2x payout
        } else {
            winnings = 0; // No match, user loses bet
        }

        // Calculate net change to user's balance (winnings - betAmount)
        const netChange = winnings - betAmount;
        userBalance.balance += netChange;

        // Save updated balance to MongoDB
        try {
            await userBalance.save();
        } catch (error) {
            console.error('Error saving balance to MongoDB:', error);
            return interaction.reply({ content: 'An error occurred while updating your balance.', ephemeral: true });
        }

        // Create an embed to display the result with different colors for win/lose
        const embed = new EmbedBuilder()
            .setColor(winnings > 0 ? '#28a745' : '#dc3545') // Green for win, Red for loss
            .setTitle('🎰 Slot Machine Results 🎰')
            .setDescription(
                `**Spin Result:** ${slot1} | ${slot2} | ${slot3}\n\n` +
                (winnings > 0
                    ? `🎉 You won **$${winnings}**!\n`
                    : `😢 You lost **$${betAmount}**\n`) +
                `**Your new balance:** $${userBalance.balance}`
            );

        // Reply with the result embed
        return interaction.reply({ embeds: [embed] });
    },
};
