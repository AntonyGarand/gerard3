const Augur = require("../utils/Augur"),
  Module = new Augur.Module(),
  u = require("../utils/utils");

Module.addCommand({name: "help",
  aliases: ["commands"],
  process: (msg, suffix) => {
    u.clean(msg);

    let prefix = u.prefix(msg);
    let commands = Module.handler.commands.filter(c => c.permissions(msg));

    let embed = u.embed()
    .setThumbnail(msg.client.user.displayAvatarURL);

    if (!suffix) { // FULL HELP
      embed
      .setTitle(msg.client.user.username + " Commands" + (msg.guild ? ` in ${msg.guild.name}.` : "."))
      .setDescription(`You have access to the following commands. For more info, type \`${prefix}help <command>\`.`);

      let categories = commands
      .filter(c => !c.hidden && c.category != "General")
      .map(c => c.category)
      .reduce((a, c, i, all) => ((all.indexOf(c) == i) ? a.concat(c) : a), [])
      .sort();

      categories.unshift("General");

      categories.forEach(category => {
        commands.filter(c => c.category == category).sort((a, b) => a.name.localeCompare(b.name)).forEach(command => {
          embed.addField(prefix + command.name + " " + command.syntax, (command.description ? command.description : "Description"), true);
        });
      });

      msg.author.send(embed);
    } else { // SINGLE COMMAND HELP
      let command = null;
      if (commands.has(suffix)) command = commands.get(suffix);
      else if (Module.handler.aliases.has(suffix)) command = Module.handler.aliases.get(suffix);
      if (command) {
        embed
        .setTitle(prefix + command.name + " help")
        .setDescription(command.info)
        .addField("Category", command.category, true)
        .addField("Usage", prefix + command.name + " " + command.syntax, true);

        if (command.aliases.length > 0) embed.addField("Aliases", command.aliases.map(a => `!${a}`).join(", "));

        msg.author.send(embed);
      } else {
        msg.reply("I don't have a command by that name.").then(u.clean);
      }
    }
  }
});

module.exports = Module;