import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

class PulseCommand extends Command {
  constructor() {
    super("pulse", {
      aliases: ["pulse", "status"],
      description: "Check the bot's heartbeat",
    });
  }

  async exec(message: Message) {
    const bot = message?.client;

    const embed = new MessageEmbed()
      .setAuthor(
        bot.user?.username + " Heartbeat",
        bot.user?.displayAvatarURL()
      )
      .setTimestamp();

    const processUptime = process.uptime();
    const botUptime = bot.uptime || 0;
    embed
      .addField(
        "Uptime",
        `Discord: ${Math.floor(botUptime / (24 * 60 * 60 * 1000))} days, ${
          Math.floor(botUptime / (60 * 60 * 1000)) % 24
        } hours, ${
          Math.floor(botUptime / (60 * 1000)) % 60
        } minutes\nProcess: ${Math.floor(
          processUptime / (24 * 60 * 60)
        )} days, ${Math.floor(processUptime / (60 * 60)) % 24} hours, ${
          Math.floor(processUptime / 60) % 60
        } minutes`,
        true
      )
      .addField(
        "Reach",
        `${bot.guilds.cache.size} Servers\n${bot.channels.cache.size} Channels\n${bot.users.cache.size} Users`,
        true
      )
      .addField("Commands Used", `Todo`, true)
      .addField(
        "Memory",
        `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`,
        true
      );

    return message.channel.send({ embed });
  }
}

module.exports = PulseCommand;

// name: "pulse",
// description: "Check the bot's heartbeat",
// category: "Bot Admin",
// hidden: true,
// permissions: msg => Module.config.adminId.includes(msg.author.id),
// process: async function(msg) {
//   let bot = msg.client;
//   let Handler = Module.handler;

//   let embed = u
//     .embed()
//     .setAuthor(
//       bot.user.username + " Heartbeat",
//       bot.user.displayAvatarURL()
//     )
//     .setTimestamp();

//   if (bot.shard) {
//     let guilds = await bot.shard.fetchClientValues("guilds.cache.size");
//     guilds = guilds.reduce((prev, val) => prev + val, 0);
//     let channels = await bot.shard.fetchClientValues("channels.cache.size");
//     channels = channels.reduce((prev, val) => prev + val, 0);
//     let mem = await bot.shard.broadcastEval(
//       "Math.round(process.memoryUsage().rss / 1024 / 1000)"
//     );
//     mem = mem.reduce((t, c) => t + c);
//     embed
//       .addField(
//         "Shards",
//         `Id: ${bot.shard.ids}\n(${bot.shard.count} total)`,
//         true
//       )
//       .addField(
//         "Total Bot Reach",
//         `${guilds} Servers\n${channels} Channels`,
//         true
//       )
//       .addField(
//         "Shard Uptime",
//         `${Math.floor(
//           bot.uptime / (24 * 60 * 60 * 1000)
//         )} days, ${Math.floor(bot.uptime / (60 * 60 * 1000)) %
//           24} hours, ${Math.floor(bot.uptime / (60 * 1000)) % 60} minutes`,
//         true
//       )
//       .addField(
//         "Shard Commands Used",
//         `${Handler.commandCount} (${(
//           Handler.commandCount /
//           (bot.uptime / (60 * 1000))
//         ).toFixed(2)}/min)`,
//         true
//       )
//       .addField("Total Memory", `${mem}MB`, true);

//     msg.channel.send(embed);
//   } else {
//     let uptime = process.uptime();
//     embed
//       .addField(
//         "Uptime",
//         `Discord: ${Math.floor(
//           bot.uptime / (24 * 60 * 60 * 1000)
//         )} days, ${Math.floor(bot.uptime / (60 * 60 * 1000)) %
//           24} hours, ${Math.floor(bot.uptime / (60 * 1000)) %
//           60} minutes\nProcess: ${Math.floor(
//           uptime / (24 * 60 * 60)
//         )} days, ${Math.floor(uptime / (60 * 60)) % 24} hours, ${Math.floor(
//           uptime / 60
//         ) % 60} minutes`,
//         true
//       )
//       .addField(
//         "Reach",
//         `${bot.guilds.cache.size} Servers\n${
//           bot.channels.cache.size
//         } Channels\n${bot.users.cache.size} Users`,
//         true
//       )
//       .addField(
//         "Commands Used",
//         `${Handler.commandCount} (${(
//           Handler.commandCount /
//           (bot.uptime / (60 * 1000))
//         ).toFixed(2)}/min)`,
//         true
//       )
//       .addField(
//         "Memory",
//         `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`,
//         true
//       );

//     msg.channel.send({ embed: embed });
//   }
// }
