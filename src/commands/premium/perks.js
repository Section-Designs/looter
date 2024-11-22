const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("premium")
    .setDescription("View the perks of premium users")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1]),
  /**
   *
   * @param {import("discord.js").CommandInteraction} interaction
   */
  async execute(interaction) {
    /**
     * @typedef {Object} Perk
     * @property {string} name - The name of the perk.
     * @property {string} value - A description of the perk.
     */

    /**
     * @typedef {Object} Pages
     * @property {number} key - The page number.
     * @property {Perk[]} perks - An array of perks associated with the page.
     */

    /**
     * A collection of pages and their corresponding perks.
     * @type {Object<number, Perk[]>}
     */
    const pages = {
      1: [
        {
          name: "**Purchase Premium**",
          value: "This first page will have information on how to get premium"
        },
        {
          name: "**How To get Premium?**",
          value: "To purchase premium, you must open a support ticket in the [Looter Bot Discord server](https://discord.gg/MKkHYcDb5f)."
        },
        {
          name: "**What the next pages will contain?**",
          value: "On the next Pages there will be a lists of commands and features you will get with looter bot premium."
        }
      ],
      2: [
        {
          name: "SongLyrics",
          value: "This will allow you to search song lyrics of any song you want."
        },
        {
          name: "Perk 2",
          value: "This is the fifth perk."
        },
        {
          name: "Perk 3",
          value: "This is the sixth perk."
        }
      ],
      3: [
        {
          name: "Perk 4",
          value: "This is the seventh perk."
        },
        {
          name: "Perk 5",
          value: "This is the eighth perk."
        },
        {
          name: "Perk 6",
          value: "This is the ninth perk."
        }
      ]
    };

    let page = 1;

    const m = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setFields(
            pages[page].map((perk) => ({
              name: perk.name,
              value: perk.value
            }))
          )
          .setColor(Colors.Fuchsia)
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("Previous")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });

    const collector = m.createMessageComponentCollector({
      time: 60000
    });

    collector.on("collect", async (button) => {
      if (button.user.id !== interaction.user.id) {
        return await button.reply({
          content: "This button is not for you!",
          ephemeral: true
        });
      }

      if (button.customId === "previous") {
        page = page === 1 ? 3 : page - 1;
      } else if (button.customId === "next") {
        page = page === 3 ? 1 : page + 1;
      }

      await button.update({
        embeds: [
          new EmbedBuilder()
            .setFields(
              pages[page].map((perk) => ({
                name: perk.name,
                value: perk.value
              }))
            )
            .setColor(Colors.Fuchsia)
        ]
      });
    });
  }
};
