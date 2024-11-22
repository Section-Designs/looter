const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Quote Message')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .setType(ApplicationCommandType.Message),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const message = interaction.targetMessage;
        const userAvatarURL = message.author.displayAvatarURL({ format: 'png', size: 1024 });
        let userAvatar;

        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(userAvatarURL);
            if (!response.ok) throw new Error('Failed to fetch image');
            const buffer = await response.buffer();
            const pngBuffer = await sharp(buffer).png().toBuffer();
            userAvatar = await loadImage(pngBuffer);
        } catch (error) {
            console.error('Error fetching avatar:', error);
            const fetch = (await import('node-fetch')).default;
            const defaultAvatarURL = 'https://cdn.discordapp.com/embed/avatars/0.png';
            const defaultResponse = await fetch(defaultAvatarURL);
            const defaultBuffer = await defaultResponse.buffer();
            userAvatar = await loadImage(defaultBuffer);
        }

        const canvas = createCanvas(900, 500);
        const context = canvas.getContext('2d');

        const bgGradient = context.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#232526');
        bgGradient.addColorStop(1, '#414345');
        context.fillStyle = bgGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const avatarSize = 150;
        context.save();
        context.beginPath();
        context.arc(avatarSize / 2 + 20, canvas.height / 2, avatarSize / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(userAvatar, 20, canvas.height / 2 - avatarSize / 2, avatarSize, avatarSize);
        context.restore();

        const quoteBoxX = avatarSize + 40;
        const quoteBoxWidth = canvas.width - quoteBoxX - 30;
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(quoteBoxX, 50, quoteBoxWidth, canvas.height - 100);

        context.fillStyle = '#FFFFFF';
        context.font = 'bold 28px sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const textX = quoteBoxX + quoteBoxWidth / 2;
        let textY = canvas.height / 2 - 40;

        const wrappedText = wrapText(context, `"${message.content}"`, 320);
        wrappedText.forEach((line, index) => {
            context.fillText(line, textX, textY + index * 35);
        });

        context.font = '22px sans-serif';
        const usernameY = textY + 35 * wrappedText.length + 10;
        context.fillText(`- ${message.author.username}`, textX, usernameY);

        context.font = '18px sans-serif';
        context.fillText(`@${message.author.tag}`, textX, usernameY + 35);

        context.font = '16px sans-serif';
        context.fillStyle = '#A9A9A9';
        context.textAlign = 'left';
        context.fillText('Looter Bot', 15, canvas.height - 20);

        const pngBuffer = canvas.toBuffer('image/png');

        try {
            await interaction.reply({
                files: [{ attachment: pngBuffer, name: 'quote.png' }],
            });
        } catch (error) {
            console.error('Error sending image:', error);
            return interaction.reply({ content: 'There was an error processing the image.', ephemeral: true });
        }
    },
};

function wrapText(context, text, maxWidth) {
    const lines = [];
    const words = text.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + word + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(currentLine);
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    }

    lines.push(currentLine);
    return lines;
}
