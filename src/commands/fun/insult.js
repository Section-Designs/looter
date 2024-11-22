const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Insult arrays for different categories
const insults = {
    general: [
        "You're as useless as a screen door on a submarine.",
        "I'd agree with you, but then we'd both be wrong.",
        "You're like a software update. Whenever I see you, I think, 'Not now.'",
        "You're proof that even evolution makes mistakes.",
        "If I wanted to hear from an asshole, I would have farted.",
        "You're like a cloud. When you disappear, it's a beautiful day."
    ],
    dirty: [
        "If you were a vegetable, you'd be a 'cabbage'.",
        "You're like a broken pencil... pointless.",
        "You're like a fart in a crowded elevator—nobody wants to be around you.",
        "You're the reason they put instructions on shampoo bottles.",
        "You're as appealing as a wet sock."
    ],
    // Add more types if desired
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insult')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Get a random insult')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of insult')
                .setRequired(true)
                .addChoices(
                    { name: 'General', value: 'general' },
                    { name: 'Dirty', value: 'dirty' }
                ))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to insult')),

    async execute(interaction) {
        // Get the type of insult and the mentioned user
        const type = interaction.options.getString('type');
        const user = interaction.options.getUser('user');

        // Get a random insult from the selected category
        const selectedInsults = insults[type];
        const randomInsult = selectedInsults[Math.floor(Math.random() * selectedInsults.length)];

        // Create the response message
        let responseMessage;
        if (user) {
            responseMessage = `${user}, ${randomInsult}`;
        } else {
            responseMessage = randomInsult;
        }

        // Create an embed to send the insult
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setDescription(responseMessage)
            .setFooter({
                text: 'Looter Bot',
                iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
            })
            .setTimestamp();

        // Send the insult as a reply
        await interaction.reply({ embeds: [embed] });
    },
};
