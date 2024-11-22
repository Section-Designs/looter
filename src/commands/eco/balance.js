const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require ('../../models/ecodatabase') // Adjust the path according to your file structure
const mongoose = require('mongoose');

// MongoDB connection (you should initialize this somewhere in your app)


module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Displays the balance of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to view the balance of')
                .setRequired(true)),
  
    /**
     *
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');

        try {
            // Find the user's balance in the database
            let userBalance = await Balance.findOne({ userId: targetUser.id });

            // If no balance is found, create a new entry with a balance of 0
            if (!userBalance) {
                userBalance = new Balance({ userId: targetUser.id });
                await userBalance.save();
            }

            // Create an embed to display the balance
            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setTitle(`${targetUser.username}'s Balance`)
                .setFooter({
                    text: 'Looter Bot',
                    iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
                })
                .setDescription(`Balance: **$${userBalance.balance}**`);

            // Reply with the embed message
            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching balance:', error);
            return interaction.reply({ content: 'There was an error while fetching the balance.' });
        }
    },
};
