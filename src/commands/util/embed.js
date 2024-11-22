const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setDescription('Send an embed!')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('The description of the embed')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('The thumbnail URL of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('image')
                .setDescription('The image URL of the embed')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('The footer text of the embed')
                .setRequired(false)),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction){
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const thumbnail = interaction.options.getString('thumbnail');
        const image = interaction.options.getString('image');
        const footer = interaction.options.getString('footer');

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('FF69B4');

        if (footer) embed.setFooter({ text: footer });
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (image) embed.setImage(image);

        await interaction.reply({ embeds: [embed] });
    },
};