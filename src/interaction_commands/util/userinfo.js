const { SlashCommandBuilder } = require("discord.js");

const emojiObject = {
  Staff: ":8485discordemployee:",
  BugHunterLevel1: ":7732discordbughunterlv1:",
  BugHunterLevel2: ":7732discordbughunterlv1:",
  Partner: ":6714discordpartner:",
  HypeSquadOnlineHouse1: ":5946discordbalance:",
  HypeSquadOnlineHouse2: ":5946discordbalance:",
  HypeSquadOnlineHouse3: ":5946discordbalance:",
  nitro: ":2937discordnitro:",
  PremiumEarlySupporter: ":3121discordearlysupporter:",
  boost: ":2017discordboost:"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setContexts([0,1,2])
    .setIntegrationTypes([0,1])
    .setDescription("Get information about a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to get information about")
        .setRequired(false)
    ),

  async execute(interaction) {
    // Get the target user; if none, use the user who invoked the command
    const targetUser = interaction.options.getUser("target") || interaction.user;

    // Initialize fields for the embed
    const fields = [
      { name: "User ID", value: targetUser.id, inline: true },
      { name: "Username", value: targetUser.username, inline: true },
      {
        name: "Discriminator",
        value: `#${targetUser.discriminator}`,
        inline: true
      },
      { name: "Bot", value: targetUser.bot ? "Yes" : "No", inline: true },
      {
        name: "Created At",
        value: targetUser.createdAt.toDateString(),
        inline: true
      }
    ];

    // Check if the command is used in a guild
    if (interaction.guild) {
      // Fetch member data if in a guild
      const member = await interaction.guild.members.fetch(targetUser.id);

      // Add server-specific info
      fields.push({
        name: "Joined Server At",
        value: member.joinedAt.toDateString(),
        inline: true
      });
    } else {
      // If in DMs, indicate that server-specific info is not available
      fields.push({ name: "Joined Server At", value: "N/A", inline: true });
    }

    // Initialize an array to store the user's flags and other indicators
    let flags = [];

    // Check if the target user has any public flags (like Staff, Partner, etc.)
    if (targetUser.flags) {
      targetUser.flags.toArray().forEach((flag) => {
        if (emojiObject[flag]) {
          flags.push(emojiObject[flag]);
        }
      });
    }

    // Check for Nitro and Server Booster flags
    const member = interaction.guild?.members.cache.get(targetUser.id);
    if (member) {
      if (member.premiumSince) {
        flags.push(emojiObject["boost"]);
      }
    }

    if (targetUser.premiumType) {
      flags.push(emojiObject["nitro"]);
    }

    // If there are any flags, add them to the fields
    if (flags.length > 0) {
      fields.push({
        name: "Flags",
        value: flags.join(" "),
        inline: true
      });
    }

    // Create the user info embed
    const userInfoEmbed = {
      color: 0x2f3136,
      title: `User Information for ${targetUser.username}`,
      thumbnail: {
        url: targetUser.displayAvatarURL({ dynamic: true })
      },
      fields: fields,
      timestamp: new Date(),
      footer: {
        text: "User Information"
      }
    };

    // Send the embed
    await interaction.reply({ embeds: [userInfoEmbed] });
  }
};