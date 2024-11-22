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
        console.error('Error parsing balances.json in slots.js:', error);
        userBalances = [];
    }
}

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
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
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

        // Update the user's balance based on the winnings
        userBalance.balance += winnings - betAmount;

        // Save updated balances to the file
        try {
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while updating your balance.', ephemeral: true });
        }

        // Create an embed to display the result
        const embed = new EmbedBuilder()
            .setColor(winnings > 0 ? '#FF69B4' : '#FF69B4')
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