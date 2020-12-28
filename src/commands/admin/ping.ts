import { Command } from "discord-akairo";
import { Message } from "discord.js";

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
    });
  }

  async exec(message: Message) {
    const sent = await message.channel.send("Pinging...");
    return sent.edit(
      `Pong! Took ${
        sent.createdTimestamp -
        (message.editedTimestamp
          ? message.editedTimestamp
          : message.createdTimestamp)
      }ms${message.client.shard ? " on shard " + message.client.shard.ids : ""}`
    );
  }
}

module.exports = PingCommand;
