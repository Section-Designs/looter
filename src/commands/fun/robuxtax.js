const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('robuxtax')
        .setDescription('Calculate the tax on your Robux.')
        .setContexts([0,1,2])
        .setIntegrationTypes([0,1])
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of Robux to calculate tax on')
                .setRequired(true) // Make this option required
        ),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount'); // Get the amount of Robux

        // Example tax rate (change this as needed)
        const taxRate = 0.30; // 30% tax

        // Calculate the tax
        const tax = amount * taxRate;
        const totalAfterTax = amount - tax;

        // Create a response message
        const response = `**Robux Amount:** ${amount}\n` +
                         `**Tax (30%):** ${tax.toFixed(2)} Robux\n` +
                         `**Total After Tax:** ${totalAfterTax.toFixed(2)} Robux`;

        // Reply with the response
        await interaction.reply(response);
    },
};