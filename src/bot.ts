import "./setup.ts";

import { AkairoClient, CommandHandler } from "discord-akairo";
import * as log4js from "log4js";
const logger = log4js.getLogger();

logger.debug("Starting Gerard!");

class GerardClient extends AkairoClient {
  commandHandler = new CommandHandler(this, {
    directory: "./src/commands/",
    prefix: "!",
    defaultCooldown: 1000,
    ignoreCooldown: [],
  });

  constructor() {
    super(
      {
        // Options for Akairo go here.
      },
      {
        // Options for discord.js goes here.
      }
    );

    logger.debug("Loading commands..");
    this.commandHandler.loadAll();
    logger.debug("Loaded all commands!");
  }
}

const client = new GerardClient();
client.login(process.env.DISCORD_TOKEN);

logger.log("Gerard started!");
