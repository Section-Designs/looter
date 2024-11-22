const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const process = require('process');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Displays information about the bot.'),
          /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        // Fetch bot information
        const botName = interaction.client.user.username;
        const nodeVersion = process.version;
        const uptime = formatUptime(process.uptime());

        // Create the embed
        const botInfoEmbed = new EmbedBuilder()
            .setTitle('Bot Information')
            .addFields(
                { name: 'Bot Name', value: botName, inline: true },
                { name: 'Node Version', value: nodeVersion, inline: true },
                { name: 'Version', value: 'Pre Release', inline: true },
                { name: 'Uptime', value: uptime, inline: true },
                { name: 'Developer', value: '<@1132738644927582321>, <@1078156074437320754>, <@803612750718697493>', inline: true }
            )
            .setThumbnail("https://cdn.discordapp.com/emojis/1297915406782300226.webp?size=96&quality=lossless")
            .setColor('#FF69B4');

        // Send the embed
        await interaction.reply({ embeds: [botInfoEmbed] });
    },
};

// Function to format the bot's uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
