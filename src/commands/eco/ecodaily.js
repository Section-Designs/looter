const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const UserBalance = require ('../../models/ecodatabase') // Adjust the path as necessary

// Daily reward amount
const DAILY_REWARD = 1000;

// Connect to MongoDB (Make sure to replace the URL with your actual MongoDB URI)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily coins reward!'),
    /**
     *
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const user = interaction.user;

        // Check if the user exists in the database
        let userBalance = await UserBalance.findOne({ userId: user.id });

        // If the user doesn't exist in the database, create a new record
        if (!userBalance) {
            userBalance = new UserBalance({
                userId: user.id,
                balance: 0,
                lastDaily: 0,
            });
            await userBalance.save();
        }

        // Check if 24 hours have passed since last claim
        const currentTime = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (currentTime - userBalance.lastDaily < oneDay) {
            const hoursLeft = Math.floor((oneDay - (currentTime - userBalance.lastDaily)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor(((oneDay - (currentTime - userBalance.lastDaily)) % (1000 * 60 * 60)) / (1000 * 60));
            return interaction.reply({ content: `You've already claimed your daily reward! Please try again in **${hoursLeft}h ${minutesLeft}m**.`, ephemeral: true });
        }

        // Add the daily reward to the user's balance and update the lastDaily time
        userBalance.balance += DAILY_REWARD;
        userBalance.lastDaily = currentTime;

        // Save updated balance to the database
        await userBalance.save();

        // Create an embed to confirm the daily reward
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('💰 Daily Reward 💰')
            .setDescription(`You received **$${DAILY_REWARD}**!\nYour new balance is **$${userBalance.balance}**.`);

        // Reply with the embed confirmation
        return interaction.reply({ embeds: [embed] });
    },
};
