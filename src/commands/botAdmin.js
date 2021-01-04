const Augur = require("../Augur"),
  path = require("path"),
  u = require("../utils/utils");

function setGame(bot) {
  if (!(bot.user.presence.game && bot.user.presence.game.url)) {
    let gameModes = [
      "Free-for-All",
      "Strikeout",
      "Experimental",
      "Brawl of the Week",
      "Ranked 1v1",
      "Ranked 2v2",
      "Brawlball",
      "Snowbrawl",
      "Dodgebomb",
      "Bombsketball",
      "Beachbrawl",
      "Switchcraft",
      "Kung Foot",
      "Horde",
      "Training",
    ];
    let game = gameModes[Math.floor(Math.random() * gameModes.length)];
    return bot.user.setActivity(game);
  }
}

function reload(files) {
  let path = require("path");
  let Utils = require(path.resolve(process.cwd(), "./src/utils/utils"));

  files.forEach((file) => {
    Utils.handler.reload(path.resolve(process.cwd(), "./src/commands/", file));
  });
}

const Module = new Augur.Module()
  .addCommand({
    name: "eval",
    category: "Bot Admin",
    hidden: true,
    process: (msg, suffix) => {
      if (msg.author.id !== Module.config.ownerId) {
        msg.channel.reply("stop it! Go away!");
        return;
      } else {
        try {
          let output = eval(suffix);
          msg.channel.send(output ? output : "null", { code: true });
        } catch (e) {
          msg.channel.send(`**ERROR:** ${e.name}\n\`\`\`\n${e.message}\`\`\``);
        }
      }
    },
    permissions: (msg) => msg.author.id === Module.config.ownerId,
  })
  .addCommand({
    name: "seval",
    category: "Bot Admin",
    hidden: true,
    process: (msg, suffix) => {
      if (msg.deletable) msg.delete();
      Module.handler.execute("eval", msg, suffix);
    },
    permissions: (msg) => msg.author.id === Module.config.ownerId,
  })
  .addCommand({
    name: "pull",
    description: "Pull bot updates from git",
    category: "Bot Admin",
    hidden: true,
    process: (msg) => {
      let spawn = require("child_process").spawn;

      u.clean(msg);

      let cmd = spawn("git", ["pull"], { cwd: process.cwd() });
      let stdout = [];
      let stderr = [];

      cmd.stdout.on("data", (data) => {
        stdout.push(data);
      });

      cmd.stderr.on("data", (data) => {
        stderr.push(data);
      });

      cmd.on("close", (code) => {
        if (code == 0)
          msg.channel
            .send(stdout.join("\n") + "\n\nCompleted with code: " + code)
            .then(u.clean);
        else
          msg.channel
            .send(`ERROR CODE ${code}:\n${stderr.join("\n")}`)
            .then(u.clean);
      });
    },
    permissions: (msg) => msg.author.id === Module.config.ownerId,
  })
  .addCommand({
    name: "botping",
    description: "Check bot ping.",
    category: "Bot Admin",
    hidden: true,
    process: (msg) => {
      msg.channel.send("Pinging...").then((sent) => {
        sent.edit(
          `Pong! Took ${
            sent.createdTimestamp -
            (msg.editedTimestamp ? msg.editedTimestamp : msg.createdTimestamp)
          }ms${msg.client.shard ? " on shard " + msg.client.shard.ids : ""}`
        );
      });
    },
  })
  .addCommand({
    name: "playing",
    category: "Bot Admin",
    hidden: true,
    description: "Set the bot's `Playing` status.",
    syntax: "[game]",
    process: (msg, suffix) => msg.client.user.setActivity(suffix),
    permissions: (msg) => Module.config.adminId.includes(msg.author.id),
  })
  .addCommand({
    name: "pulse",
    description: "Check the bot's heartbeat",
    category: "Bot Admin",
    hidden: true,
    permissions: (msg) => Module.config.adminId.includes(msg.author.id),
    process: async function (msg, suffix) {
      let bot = msg.client;
      let Handler = Module.handler;

      let embed = u
        .embed()
        .setAuthor(bot.user.username + " Heartbeat", bot.user.displayAvatarURL)
        .setTimestamp();

      if (bot.shard) {
        let guilds = await bot.shard.fetchClientValues("guilds.cache.size");
        guilds = guilds.reduce((prev, val) => prev + val, 0);
        let channels = await bot.shard.fetchClientValues("channels.cache.size");
        channels = channels.reduce((prev, val) => prev + val, 0);
        let mem = await bot.shard.broadcastEval(
          "Math.round(process.memoryUsage().rss / 1024 / 1000)"
        );
        mem = mem.reduce((t, c) => t + c);
        embed
          .addField(
            "Shards",
            `Id: ${bot.shard.ids}\n(${bot.shard.count} total)`,
            true
          )
          .addField(
            "Total Bot Reach",
            `${guilds} Servers\n${channels} Channels`,
            true
          )
          .addField(
            "Shard Uptime",
            `${Math.floor(bot.uptime / (24 * 60 * 60 * 1000))} days, ${
              Math.floor(bot.uptime / (60 * 60 * 1000)) % 24
            } hours, ${Math.floor(bot.uptime / (60 * 1000)) % 60} minutes`,
            true
          )
          .addField(
            "Shard Commands Used",
            `${Handler.commandCount} (${(
              Handler.commandCount /
              (bot.uptime / (60 * 1000))
            ).toFixed(2)}/min)`,
            true
          )
          .addField("Total Memory", `${mem}MB`, true);

        msg.channel.send(embed);
      } else {
        let uptime = process.uptime();
        embed
          .addField(
            "Uptime",
            `Discord: ${Math.floor(bot.uptime / (24 * 60 * 60 * 1000))} days, ${
              Math.floor(bot.uptime / (60 * 60 * 1000)) % 24
            } hours, ${
              Math.floor(bot.uptime / (60 * 1000)) % 60
            } minutes\nProcess: ${Math.floor(uptime / (24 * 60 * 60))} days, ${
              Math.floor(uptime / (60 * 60)) % 24
            } hours, ${Math.floor(uptime / 60) % 60} minutes`,
            true
          )
          .addField(
            "Reach",
            `${bot.guilds.size} Servers\n${bot.channels.size} Channels\n${bot.users.size} Users`,
            true
          )
          .addField(
            "Commands Used",
            `${Handler.commandCount} (${(
              Handler.commandCount /
              (bot.uptime / (60 * 1000))
            ).toFixed(2)}/min)`,
            true
          )
          .addField(
            "Memory",
            `${Math.round(process.memoryUsage().rss / 1024 / 1000)}MB`,
            true
          );

        msg.channel.send({ embed: embed });
      }
    },
  })
  .addCommand({
    name: "gotobed",
    category: "Bot Admin",
    hidden: true,
    aliases: ["x"],
    process: async function (msg, shard) {
      try {
        await msg.react("🛌");
        let fs = require("fs");
        let files = fs.readdirSync(
          path.resolve(process.cwd(), "./src/commands")
        );

        files.forEach((file) => {
          Module.handler.unload(
            path.resolve(process.cwd(), "./src/commands/", file)
          );
        });

        if (msg.client.shard) {
          let shardId = parseInt(shard, 10);
          if (shardId && msg.client.shard.ids[0] === shardId) {
            await msg.client.destroy();
            process.exit();
          } else if (shardId) {
            msg.client.shard
              .broadcastEval(
                `if (this.shard.ids == ${shardId}) this.destroy().then(() => process.exit())`
              )
              .catch((e) => u.alertError(e, msg));
          } else {
            msg.client.shard.broadcastEval(
              "this.destroy().then(() => process.exit())"
            );
          }
        } else {
          await msg.client.destroy();
          process.exit();
        }
      } catch (e) {
        u.alertError(e, msg);
      }
    },
    permissions: (msg) => Module.config.adminId.includes(msg.author.id),
  })
  .addCommand({
    name: "reload",
    category: "Bot Admin",
    hidden: true,
    syntax: "[file1.js] [file2.js]",
    description: "Reload command files.",
    info:
      "Use the command without a suffix to reload all command files.\n\nUse the command with the module name (including the `.js`) to reload a specific file.",
    process: async (msg, suffix) => {
      console.log(msg);
      u.clean(msg);
      let path = require("path");
      let fs = require("fs");
      let files = suffix
        ? suffix.split(" ")
        : fs.readdirSync(path.resolve(process.cwd(), "./src/commands"));

      if (!msg.client.shard) {
        reload(files);
      } else {
        try {
          await msg.client.shard.broadcastEval(
            `(${reload})([${files.map((file) => `"${file}"`).join()}])`
          );
        } catch (e) {
          u.alertError(e, msg);
        }
      }
      await msg.react("👌");
    },
    permissions: (msg) => Module.config.adminId.includes(msg.author.id),
  })
  .addEvent("disconnect", async () => {
    try {
      let embed = u
        .embed()
        .setTimestamp()
        .setTitle("Bot Disconnect")
        .setDescription(
          (Module.handler.client.shard
            ? "Shard " + Module.handler.client.shard.id
            : "Bot") + " has disconnected. I will try restarting the bot."
        );
      await u.errorLog.send({ embed });
      process.exit();
    } catch (error) {
      u.alertError(error);
      process.exit();
    }
  })
  .setInit((reload = false) => {
    u.errorLog.send(
      u
        .embed()
        .setTimestamp()
        .setDescription(
          (Module.handler.client.shard
            ? "Shard " + Module.handler.client.shard.ids
            : "Bot") + " is ready!"
        )
    );
  })
  .setUnload(() => true)
  .setClockwork(() => {
    setGame(Module.handler.client);
    return setInterval(setGame, 180 * 60 * 1000, Module.handler.client);
  });

module.exports = Module;
