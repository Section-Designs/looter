const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Attempt to load the user balances from file
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data.trim() ? JSON.parse(data) : []; // Only parse if data is non-empty
    } catch (error) {
        console.error('Error parsing balances.json:', error);
        userBalances = []; // Fallback to an empty array
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wire')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Wire money to another user.')
        .addUserOption(option =>
            option.setName('recipient')
                .setDescription('The user to send money to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to send')
                .setRequired(true)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const sender = interaction.user;
        const recipient = interaction.options.getUser('recipient');
        const amount = interaction.options.getInteger('amount');

        // Find sender and recipient balances
        const senderBalance = userBalances.find(user => user.id === sender.id) || { id: sender.id, balance: 0 };
        const recipientBalance = userBalances.find(user => user.id === recipient.id) || { id: recipient.id, balance: 0 };

        // Check if the sender has enough balance
        if (senderBalance.balance < amount) {
            return interaction.reply({ content: `You do not have enough funds to send **${amount}**.`, ephemeral: true });
        }

        // Adjust balances
        senderBalance.balance -= amount;
        recipientBalance.balance += amount;

        // Save updated balances (re-serialize and update the balances file)
        try {
            userBalances = userBalances.filter(user => user.id !== sender.id && user.id !== recipient.id); // Remove old records
            userBalances.push(senderBalance, recipientBalance); // Push updated records
            fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving balances.json:', error);
            return interaction.reply({ content: 'An error occurred while processing the transaction.', ephemeral: true });
        }

        // Create an embed to confirm the transaction
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(`Successfully wired **$${amount}** to **${recipient.username}**!`);

        return interaction.reply({ embeds: [embed] });
    },
};
