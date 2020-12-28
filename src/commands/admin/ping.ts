import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { logger } from "@utils/logger";

// @tslint: disable
export default class extends Command {
  ownerOnly = true;

  constructor() {
    super("ping", {
      aliases: ["ping", "pong", "trace"],
      description: { content: "View latency" },
    });
  }

  public async exec(message: Message) {
    this.client.test();
    try {
      await message.util.send("Requesting...");
      const estimatedPing =
        message.util.lastResponse.createdTimestamp - message.createdTimestamp;
      const roundInt = Math.round(estimatedPing / 50);

      return message.util.edit([
        `Po${"o".repeat(roundInt)}ng!`,
        `\n:arrows_counterclockwise: Roundtrip: ${estimatedPing}ms`,
        `:heart: ws: ${Math.round(this.client.ws.ping)}ms`,
      ]);
    } catch (err) {
      logger.error(err);
    }
  }
}
