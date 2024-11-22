const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Define the path to the balances file
const balancesFilePath = path.join('C:', 'Users', 'sunsh', 'Downloads', 'looter', 'src', 'listeners', 'eco', 'balances.json');

// Attempt to read the file, handling any errors
let userBalances = [];
if (fs.existsSync(balancesFilePath)) {
    try {
        const data = fs.readFileSync(balancesFilePath, 'utf-8');
        userBalances = data ? JSON.parse(data) : []; // Initialize to an empty array if file is empty
    } catch (error) {
        console.error('Error parsing balances.json:', error);
        userBalances = []; // Use empty array as fallback
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Add money to a user\'s balance (Admins only).')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to add money to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of money to add')
                .setRequired(true)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        // Define an array of owner user IDs
        const ownerUserIDs = ['1132738644927582321', '1067084874357407755', '1078156074437320754' ]; // Replace with actual user IDs

        // Check if the user executing the command is an owner
        if (!ownerUserIDs.includes(interaction.user.id)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // Find or initialize the target user's balance
        let userBalance = userBalances.find(user => user.id === targetUser.id);
        if (!userBalance) {
            userBalance = { id: targetUser.id, balance: amount };
            userBalances.push(userBalance);
        } else {
            // Add the specified amount to the user's balance
            userBalance.balance += amount;
        }

        // Save updated balances to the file
        fs.writeFileSync(balancesFilePath, JSON.stringify(userBalances, null, 2), 'utf-8');

        // Create an embed to confirm the transaction
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(`Successfully added **$${amount}** to **<@${targetUser.id}>'s** balance.`);

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
