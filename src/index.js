const { Client, Collection, REST, Routes } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const config = require("./util/config");
const mongoose = require("mongoose");

const build = async () => {
  const client = new Client({
    intents: 3276799
  });

  client.commands = new Collection();
  client.contextMenus = new Collection();

  const buildCommands = async () => {
    const commandsPath = path.join(process.cwd(), "/src/interaction_commands");
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

  const buildContextMenus = async () => {
    const contextMenusPath = path.join(process.cwd(), "/src/context_menus");
    const folders = readdirSync(contextMenusPath);
    for (const folder of folders) {
      const folderPath = path.join(contextMenusPath, folder);
      const files = readdirSync(folderPath).filter((file) =>
        file.endsWith(".js")
      );
      for (const file of files) {
        const contextMenu = require(path.join(folderPath, file));
        client.contextMenus.set(contextMenu.data.name, contextMenu);
      }
    }
  };

  const buildEvents = async () => {
    const listenersPath = path.join(process.cwd(), "/src/listeners");
    const folders = readdirSync(listenersPath);
    for (const folder of folders) {
      const folderPath = path.join(listenersPath, folder);
      const files = readdirSync(folderPath).filter((file) =>
        file.endsWith(".js")
      );
      for (const file of files) {
        const event = require(path.join(folderPath, file));
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    }
  };

  await buildCommands();
  await buildContextMenus();
  await buildEvents();

  const rest = new REST({ version: "9" }).setToken(config.discord.token);

  try {
    await rest.put(Routes.applicationCommands(config.discord.client), {
      body: client.commands.map((command) => command.data.toJSON())
    });
  } catch (e) {
    console.error(e);
  }

  client.login(config.discord.token);
};

mongoose.connect('mongodb+srv://Baza:123456578686@bazascluster.wkprz.mongodb.net/?retryWrites=true&w=majority',
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

build();