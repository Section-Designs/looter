const { SlashCommandBuilder, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Latency and API response times")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1]),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
  async execute(interaction) {
    const message = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("<a:Loading1:1299154239213277267>")
          .setColor(Colors.Fuchsia)
      ]
    });

    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    await message.edit({
      embeds: [
        new EmbedBuilder()
          .setDescription(`<:check:1299157660284751918> ${latency}ms`)
          .setColor(Colors.LuminousVividPink)
      ]
    });
  }
};
