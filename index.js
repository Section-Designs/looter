const { Client, Collection, REST, Routes, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const config = require("./util/config");
const mongoose = require("mongoose");

const build = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  client.commands = new Collection();

  // Load commands
  const buildCommands = async () => {
    const commandsPath = path.join(process.cwd(), "/src/commands");
    const folders = readdirSync(commandsPath);
    for (const folder of folders) {
      const folderPath = path.join(commandsPath, folder);
      const files = readdirSync(folderPath).filter((file) =>
        file.endsWith(".js")
      );
      for (const file of files) {
        const command = require(path.join(folderPath, file));
        client.commands.set(command.data.name, command);
      }
    }
  };

  // Load events
  const buildEvents = async () => {
    const listenersPath = path.join(process.cwd(), "/src/listeners");
    const files = readdirSync(listenersPath).filter((file) =>
      file.endsWith(".js")
    );
    for (const file of files) {
      const event = require(path.join(listenersPath, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  };

  await buildCommands();
  await buildEvents();

  // Register commands with Discord API
  const rest = new REST({ version: "10" }).setToken(config.discord.token);

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity({ type: "WATCHING", name: "Looters" });
  });

  try {
    await rest.put(Routes.applicationCommands(config.discord.client), {
      body: client.commands.map((command) => command.data.toJSON()),
    });
    console.log("Successfully registered application commands.");
  } catch (e) {
    console.error("Error registering application commands:", e);
  }

  client.login(config.discord.token);
};

// MongoDB connection
mongoose.connect(
  'mongodb+srv://Baza:123456578686@bazascluster.wkprz.mongodb.net/?retryWrites=true&w=majority',
);