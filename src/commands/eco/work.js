const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/ecodatabase'); // Import the User model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work to earn some money!'),

  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const user = interaction.user;
        
        // Calculate a random amount of money earned from "work"
        const earnings = Math.floor(Math.random() * 100) + 1; // Earn between 1 and 100

        // Check if the user already exists in the database, or create a new entry
        let userBalance = await User.findOne({ id: user.id });

        if (!userBalance) {
            // If the user doesn't exist, create a new one with a balance of 0
            userBalance = new User({ id: user.id, balance: 0 });
        }

        // Add earnings to the user's balance
        userBalance.balance += earnings;

        // Save the updated balance to MongoDB
        try {
            await userBalance.save(); // Save the updated balance to the database
        } catch (error) {
            console.error('Error saving user balance to MongoDB:', error);
            return interaction.reply({ content: 'An error occurred while saving your balance.', ephemeral: true });
        }

        // Respond with an embed message showing the earnings
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(`You worked hard and earned **$${earnings}**! Your new balance is **$${userBalance.balance}**.`);

        return interaction.reply({ embeds: [embed] });
    },
};
