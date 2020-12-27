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

//   .addCommand({
//     name: "botping",
//     description: "Check bot ping.",
//     category: "Bot Admin",
//     hidden: true,
//     process: msg => {
//       msg.channel.send("Pinging...").then(sent => {
//         sent.edit(
//           `Pong! Took ${sent.createdTimestamp -
//             (msg.editedTimestamp
//               ? msg.editedTimestamp
//               : msg.createdTimestamp)}ms${
//             msg.client.shard ? " on shard " + msg.client.shard.ids : ""
//           }`
//         );
//       });
//     }
//   })
