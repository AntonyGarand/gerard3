import "./setup.ts";

import { AkairoClient, CommandHandler } from "discord-akairo";
import { Message } from "discord.js";

import { logger } from "@utils/logger";
import { IGerardClient } from "../types/GerardClient";
import { bhidResolver } from "@utils/bhid";
import { Guild } from "./database/guild";
import { db } from "./database";

logger.debug("Starting Gerard!");

export class GerardClient extends AkairoClient implements IGerardClient {
  public commandHandler = new CommandHandler(this, {
    directory: "./src/commands/",
    prefix: "!",
    defaultCooldown: 1000,
    commandUtil: true,
    argumentDefaults: {
      prompt: {
        cancel: (msg: Message) => `${msg.author}, command cancelled.`,
        ended: (msg: Message) => `${msg.author}, command declined.`,
        modifyRetry: (msg, text) =>
          text &&
          `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
        modifyStart: (msg, text) =>
          text &&
          `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
        retries: 3,
        time: 30000,
        timeout: (msg: Message) => `${msg.author}, command expired.`,
      },
    },
  });

  public logger = logger;

  constructor() {
    super(
      {
        ownerID: process.env.OWNER_IDS?.split(","),
        // Options for Akairo go here.
      },
      {
        // Options for discord.js goes here.
      }
    );

    logger.debug("Loading commands..");
    this.commandHandler.loadAll();
    logger.debug("Loaded all commands!");
    this.addBhidType();
  }
  public addBhidType() {
    this.commandHandler.resolver.addType("bhid", bhidResolver);
  }
}

const client = new GerardClient();
client.login(process.env.DISCORD_TOKEN);

logger.info("Gerard started!");

logger.info('Database test');
(async ()=>{
  logger.info(null,'Syncing model..');
  await db.sync();
  logger.info('Inserting sample guild..');
  const newGuild = await Guild.create({
    guildId: '1234',
    name: 'fake guild',
    botChannels: [],
    autoRole: false,
    roles: [],
    adminRoles: [],
    modRoles: [],
    serverLanguage: 'en',
  });
  logger.info(newGuild.adminRoles);
})()