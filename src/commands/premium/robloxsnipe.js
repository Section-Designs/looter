const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription("Check if a user is currently in an activity")
        .addStringOption(option =>
            option.setName('username')
                .setDescription("Discord username (without the #tag)")
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const user = interaction.guild.members.cache.find(member => member.user.username === username);

        if (!user) {
            return interaction.reply(`User with the username **${username}** was not found in this server.`);
        }

        const activity = user.presence?.activities[0];

        if (activity) {
            const activityEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${user.user.username}'s Current Activity`)
                .addField('Activity', activity.name, true)
                .addField('Type', activity.type, true);

            if (activity.details) activityEmbed.addField('Details', activity.details, true);
            if (activity.state) activityEmbed.addField('State', activity.state, true);

            return interaction.reply({ embeds: [activityEmbed] });
        } else {
  
            return interaction.reply(`**${user.user.username}** is not currently engaged in any activity.`);
        }
    }
};