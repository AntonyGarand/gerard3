import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { logger } from "@utils/logger";

export default class BrawlhallaStatsCommand extends Command {
  constructor() {
    super("stats", {
      aliases: ["stats", "bhstats"],
      description: {
        usage: "[bhid | @User]",
        examples: ["", "@Anyny0", "931071"],
        content:
          "Retrieves stats for yourself, a mentioned user (if they have `claim`ed their profile) or a given Brawlhalla ID.",
      },
      args: [
        {
          id: "target",
          match: "rest",
          type: "",
          default: null,
          prompt: {
            start: "what would you like to say?",
            retry: "You need to specify something!",
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: {}) {
    try {
      logger.debug(args);
    } catch (err) {
      logger.error(err);
    }
  }
}
