const { Logger } = require("../../util/logger");
const log = new Logger();

module.exports = {
  name: "ready",
  /**
   *
   * @param {import("discord.js").Client} client
   */
  execute(client) {
    // log.info(`${client.user.username} is now online`);
    // log.info(`Serving ${client.users.cache.size} users`);

    console.log(`${client.user.username} is now online`);
  }
};
