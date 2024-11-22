const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randomcat')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Get a random cat image'),

    async execute(interaction) {
        try {
            // Use dynamic import to load node-fetch
            const fetch = (await import('node-fetch')).default;

            // Fetch random cat image from The Cat API
            const response = await fetch('https://api.thecatapi.com/v1/images/search');

            // Check if the response is OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Extract the image URL
            const imageUrl = data[0].url;

            // Send the image as a reply
            await interaction.reply({ content: imageUrl });
        } catch (error) {
            console.error('Error fetching random cat image:', error);
            await interaction.reply('Could not fetch a random cat image at this time.');
        }
    },
};
