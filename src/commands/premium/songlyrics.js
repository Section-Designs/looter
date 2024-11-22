const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cheerio = require('cheerio');
const PremiumUser = require('../../models/premium'); // Import the premium model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Fetch the lyrics for a song.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the song')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('artist')
                .setDescription('The artist of the song')
                .setRequired(false)),

    async execute(interaction) {
        // Use dynamic import for node-fetch
        const fetch = (await import('node-fetch')).default;

        const songTitle = interaction.options.getString('title');
        const artistName = interaction.options.getString('artist') || '';

        // Check if the user has premium access
        const userId = interaction.user.id;
        const hasPremium = await PremiumUser.findOne({ userId });

        if (!hasPremium) {
            return interaction.reply('You must purchase premium to use this command! Run /premium for more info');
        }

        await interaction.deferReply({ fetchReply: true });

        const geniusToken = process.env.GENIUS_API_KEY;
        if (!geniusToken) {
            return interaction.editReply('Genius API key is missing. Please contact the bot admin.');
        }

        try {
            const searchQuery = `${songTitle} ${artistName}`.trim();
            const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(searchQuery)}`;
            const response = await fetch(searchUrl, {
                headers: { Authorization: `Bearer ${geniusToken}` }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data from Genius API: ${response.statusText}`);
            }

            const data = await response.json();
            const hits = data.response.hits;

            if (hits.length === 0) {
                return interaction.editReply(`Could not find lyrics for "${songTitle}" by ${artistName || 'unknown artist'}.`);
            }

            const songData = hits[0].result;
            const lyricsUrl = songData.url;

            const lyricsResponse = await fetch(lyricsUrl);
            const lyricsHtml = await lyricsResponse.text();
            const lyrics = extractLyrics(lyricsHtml);

            const lyricChunks = splitLyrics(lyrics); // Split lyrics into sections
            if (lyricChunks.length === 0) {
                return interaction.editReply(`Could not find any lyrics to display for "${songTitle}" by ${artistName || 'unknown artist'}.`);
            }

            let currentIndex = 0;

            const embed = createLyricsEmbed(songData, lyricChunks[currentIndex], lyricsUrl, interaction.client.user.displayAvatarURL());
            const row = createButtonRow(lyricChunks.length, currentIndex);

            const reply = await interaction.editReply({ embeds: [embed], components: row ? [row] : [] });

            const filter = i => i.user.id === interaction.user.id;
            const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (buttonInteraction) => {
                await buttonInteraction.deferUpdate();

                if (buttonInteraction.customId === 'next') {
                    currentIndex = Math.min(currentIndex + 1, lyricChunks.length - 1);
                } else if (buttonInteraction.customId === 'back') {
                    currentIndex = Math.max(currentIndex - 1, 0);
                }

                const newEmbed = createLyricsEmbed(songData, lyricChunks[currentIndex], lyricsUrl, interaction.client.user.displayAvatarURL());
                const newRow = createButtonRow(lyricChunks.length, currentIndex);

                await interaction.editReply({ embeds: [newEmbed], components: newRow ? [newRow] : [] });
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] });
            });

        } catch (error) {
            console.error('Error fetching lyrics:', error);
            return interaction.editReply('There was an error retrieving the lyrics. Please try again later.');
        }
    },
};

// Function to extract lyrics from HTML
function extractLyrics(html) {
    const $ = cheerio.load(html);
    const lyrics = $('div[data-lyrics-container="true"]').text();
    // Split the lyrics into lines and join with newline characters
    return lyrics.length > 0 ? lyrics.trim().replace(/\n/g, '\n') : 'Lyrics not found.'; // Keep line breaks
}

// Function to split lyrics into sections for pagination
function splitLyrics(lyrics) {
    const sections = lyrics.split(/\[(.*?)\]/g); // Split by section headers
    const chunks = [];

    for (let i = 1; i < sections.length; i += 2) {
        const title = `[${sections[i]}]`;
        const content = sections[i + 1] || '';
        chunks.push(`${title}\n${content.trim().replace(/\n/g, '\n')}`); // Keep line breaks
    }

    return chunks;
}

// Function to create the lyrics embed
function createLyricsEmbed(songData, lyrics, lyricsUrl, botAvatarUrl) {
    return new EmbedBuilder()
        .setColor('#FF69B4')
        .setTitle(`${songData.full_title}`)
        .setURL(lyricsUrl)
        .setThumbnail(songData.song_art_image_thumbnail_url)
        .setDescription(lyrics)
        .setFooter({ text: 'Looter Bot', iconURL: botAvatarUrl });
}

// Function to create the button row for pagination
function createButtonRow(chunkCount, currentIndex = 0) {
    const row = new ActionRowBuilder();

    if (currentIndex > 0) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('back')
                .setLabel('Back')
                .setStyle(ButtonStyle.Primary)
        );
    }

    if (currentIndex < chunkCount - 1) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
        );
    }

    // Return the row only if it contains components
    return row.components.length > 0 ? row : null;
}
