const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../models/ecodatabase'); // Import the User model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wire')
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

        // Retrieve sender and recipient balances from MongoDB
        let senderBalance = await User.findOne({ id: sender.id });
        let recipientBalance = await User.findOne({ id: recipient.id });

        // If sender or recipient don't exist in the database, create them
        if (!senderBalance) {
            senderBalance = new User({ id: sender.id, balance: 0 });
        }
        if (!recipientBalance) {
            recipientBalance = new User({ id: recipient.id, balance: 0 });
        }

        // Check if the sender has enough balance
        if (senderBalance.balance < amount) {
            return interaction.reply({ content: `You do not have enough funds to send **${amount}**.`, ephemeral: true });
        }

        // Adjust balances
        senderBalance.balance -= amount;
        recipientBalance.balance += amount;

        // Save updated balances to MongoDB
        try {
            await senderBalance.save();
            await recipientBalance.save();
        } catch (error) {
            console.error('Error saving balances to MongoDB:', error);
            return interaction.reply({ content: 'An error occurred while processing the transaction.', ephemeral: true });
        }

        // Create an embed to confirm the transaction
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(`Successfully wired **$${amount}** to **${recipient.username}**!`);

        return interaction.reply({ embeds: [embed] });
    },
};
