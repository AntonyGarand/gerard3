import "./setup.ts";

import { AkairoClient, CommandHandler } from "discord-akairo";
import * as log4js from "log4js";
const logger = log4js.getLogger();

logger.debug("Starting Gerard!");

class GerardClient extends AkairoClient {
  commandHandler = new CommandHandler(this, {
    directory: "./src/commands/",
    prefix: "!",
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

    this.commandHandler.loadAll();
    logger.debug('Loaded all commands!');
  }
}

const client = new GerardClient();
client.login(process.env.DISCORD_TOKEN);
