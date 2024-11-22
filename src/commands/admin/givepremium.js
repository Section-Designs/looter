const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, EmbedBuilder } = require('discord.js');
const PremiumUser = require('../../models/premium'); // Adjust path if needed

module.exports = {
    data: new SlashCommandBuilder()
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setName('givepremium')
        .setDescription('Adds a user to the premium list.')
        .addUserOption(option => option.setName('user').setDescription('User to grant premium').setRequired(true)),

    async execute(interaction) {
        // Check if the command user is the specific user allowed to use this command
        const allowedUserId = '1067084874357407755';
        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');

        // Fetch guild member to check if they are in the specific server
        const guildId = '1297311652890280070';
        const guild = interaction.client.guilds.cache.get(guildId);
        if (!guild) {
            return interaction.reply({ content: 'The specified server could not be found.', ephemeral: true });
        }

        const member = await guild.members.fetch(user.id).catch(() => null);
        if (!member) {
            return interaction.reply({ content: `${user.tag} is not a member of the specified server.`, ephemeral: true });
        }

        try {
            // Add user to the premium database
            const newPremiumUser = new PremiumUser({ userId: user.id });
            await newPremiumUser.save();

            // Assign the premium role
            const premiumRoleId = '1298383358094475324';
            const premiumRole = interaction.guild.roles.cache.get(premiumRoleId);
            if (premiumRole) {
                await member.roles.add(premiumRole);
            }

            // Confirmation Embed
            const embed = new EmbedBuilder()
                .setTitle('Premium Access Granted')
                .setDescription(`${user.tag} has been added to the premium list and given the premium role.`)
                .setColor(0x2F3136);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error (user already in DB)
                return interaction.reply({ content: `${user.tag} is already a premium member.`, ephemeral: true });
            } else {
                console.error(error);
                return interaction.reply({ content: 'An error occurred while adding the user to premium.', ephemeral: true });
            }
        }
    }
};
