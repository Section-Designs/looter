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
        userBalances = data.trim() ? JSON.parse(data) : []; // Initialize to an empty array if data is empty
    } catch (error) {
        console.error('Error parsing balances.json:', error);
        userBalances = []; // Use an empty array as a fallback
    }
}

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

        // Find the balance for the specified user
        const userBalance = userBalances.find(user => user.id === targetUser.id);

        // If the user doesn't have a balance entry, set it to zero by default
        const balance = userBalance ? userBalance.balance : 0;

        // Create an embed to display the balance
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setTitle(`${targetUser.username}'s Balance`)
            .setFooter({
                text: 'Looter Bot',
                iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
            })
            .setDescription(`Balance: 
                **$${balance}**`);

        // Reply with the embed message
        return interaction.reply({ embeds: [embed] });
    },
};
