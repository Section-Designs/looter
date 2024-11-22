const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');

const command = {
    data: new SlashCommandBuilder()
        .setName('roblox-user')
        .setContexts([0, 1, 2])
        .setIntegrationTypes([0, 1])
        .setDescription('Fetches the Roblox user avatar and headshot.')
        .addStringOption(option =>
            option.setName('roblox-id')
                .setDescription('The Roblox user ID to fetch the avatar for')
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false }); // Acknowledge the interaction

        const robloxUserId = interaction.options.getString('roblox-id');

        // Fetch the user's information to get the username and description
        const userResponse = await fetch(`https://users.roblox.com/v1/users/${robloxUserId}`, {
            method: 'GET',
            headers: { 'accept': 'application/json' },
        });

        const receivedUser = await userResponse.json();
        if (!receivedUser || !receivedUser.id) {
            return interaction.editReply({ content: "Internal Server Error: failed to fetch User's information" });
        }

        // Fetch friends count
        let friendsCount = 0;
        const friendsResponse = await fetch(`https://friends.roblox.com/v1/users/${robloxUserId}/friends`, {
            method: 'GET',
            headers: { 'accept': 'application/json' },
        });

        const friendsData = await friendsResponse.json();
        if (friendsData && Array.isArray(friendsData.data)) {
            friendsCount = friendsData.data.length; // Count number of friends
        }

        // Fetch followers count
        let followersCount = 0;
        const followersResponse = await fetch(`https://friends.roblox.com/v1/users/${robloxUserId}/followers`, {
            method: 'GET',
            headers: { 'accept': 'application/json' },
        });

        const followersData = await followersResponse.json();
        if (followersData && Array.isArray(followersData.data)) {
            followersCount = followersData.data.length; // Count number of followers
        }

        // Fetch the avatar
        const avatarResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${robloxUserId}&size=720x720&format=Png&isCircular=false`, { 
            method: 'GET', 
            headers: { 'accept': 'application/json' } 
        });

        const receivedAvatar = await avatarResponse.json();
        if (!receivedAvatar || !receivedAvatar.data || receivedAvatar.data.length === 0) {
            return interaction.editReply({ content: "Internal Server Error: failed to fetch User's Avatar" });
        }

        // Fetch the headshot
        const headshotResponse = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=720x720&format=Png&isCircular=false`, {
            method: 'GET',
            headers: { 'accept': 'application/json' },
        });

        const receivedHeadshot = await headshotResponse.json();
        if (!receivedHeadshot || !receivedHeadshot.data || receivedHeadshot.data.length === 0) {
            return interaction.editReply({ content: "Internal Server Error: failed to fetch User's Headshot" });
        }

        // Fetch user presence to check if they are currently online
        let isOnline = "Offline"; // Default to offline
        try {
            const presenceResponse = await fetch(`https://presence.roblox.com/v1/presence/users/${robloxUserId}`, {
                method: 'GET',
                headers: { 'accept': 'application/json' },
            });

            const receivedPresence = await presenceResponse.json();

            // Check if userPresence exists
            if (receivedPresence && receivedPresence.userPresences) {
                // Check if the user presence array has at least one item
                if (Array.isArray(receivedPresence.userPresences) && receivedPresence.userPresences.length > 0) {
                    // Get the first user presence
                    const userPresence = receivedPresence.userPresences[0];
                    // Check the user's status
                    if (userPresence && userPresence.userId === robloxUserId) {
                        isOnline = userPresence.state === "Online" ? "Online" : "Offline";
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user presence:", error);
            // Handle error as needed
        }

        // Format the account creation date
        const createdDate = new Date(receivedUser.created);
        const formattedDate = createdDate.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Prepare the embed response
        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle(`${receivedUser.name}`) // Title
            .setDescription(`Status: ${isOnline}
                **Description:** ${receivedUser.description || 'No description available.'}
                **Account Created:** ${formattedDate}
                **Friends:** ${friendsCount}
                **Followers:** ${followersCount}`) // Include user description, account creation date, friends count, and followers count
            .setThumbnail(receivedHeadshot.data[0].imageUrl)
            .setFooter({
                text: 'Looter Bot',
                iconURL: 'https://cdn.discordapp.com/emojis/1297915406782300226.png'
            });

        // Create the button
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link) // Set button style to Link
            .setLabel('View Profile') // Button label
            .setURL(`https://www.roblox.com/users/${receivedUser.id}/profile`); // URL to Roblox user profile

        // Create an action row for the button
        const row = new ActionRowBuilder()
            .addComponents(button);

        // Reply with the embed and the button
        return interaction.editReply({ embeds: [embed], components: [row] });
    }
};

module.exports = command;