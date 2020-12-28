import { Command } from "discord-akairo";
import { Message, TextChannel, MessageEmbed } from "discord.js";
import toTitleCase from "@utils/titleCase";

export default class extends Command {
  protected titles: Map<string, string> = new Map();

  constructor() {
    super("help", {
      aliases: ["help", "commands"],
      description: {
        content: "Displays available commands or command information",
        usage: "[command name]",
        examples: ["", "ping", "play"],
      },
      flags: ["--pub", "--public"],
      args: [
        {
          id: "command",
          type: "commandAlias",
        },
        {
          id: "pub",
          type: "string",
          match: "flag",
          flag: ["--pub", "--public"],
        },
      ],
    });

    this.titles.set("admin", "Administrative features");
    this.titles.set("server", "Server features");
    this.titles.set("util", "Utilities");
  }

  public async exec(
    message: Message,
    { command, pub }: { command: Command; pub: boolean }
  ) {
    if (!command) return this.defaultHelp(message, pub);

    const prefix = "!";
    const clientPermissions = command.clientPermissions as string[];
    const userPermissions = command.userPermissions as string[];
    const examples: string[] = command.description.examples;

    const embed = new MessageEmbed()
      .setTitle(
        `${prefix}${command} ${
          command.description.usage ? command.description.usage : ""
        }`
      )
      .setDescription(command.description.content);

    if (process.env.HOMEPAGE) {
      embed.setURL(process.env.HOMEPAGE + "commands");
    }

    if (clientPermissions)
      embed.addField(
        "Required Bot Permissions",
        clientPermissions.map((p) => `\`${toTitleCase(p)}\``).join(", ")
      );
    if (userPermissions)
      embed.addField(
        "Required User Permissions:",
        userPermissions.map((p) => `\`${toTitleCase(p)}\``).join(", ")
      );
    if (command.aliases.length > 1)
      embed.addField(
        "Aliases",
        command.aliases
          .slice(1)
          .map((a) => `\`${a}\``)
          .join(", ")
      );
    if (examples)
      embed.addField(
        "Examples",
        examples.map((e) => `${prefix}${command} ${e}`).join("\n")
      );

    return message.util.send(embed);
  }

  public async defaultHelp(message: Message, pub = false) {
    const prefix = "!";
    const embed = new MessageEmbed()
      .setTitle("Commands")
      .setDescription([
        message.guild ? `This server's prefix is \`${prefix}\`` : "",
        `For more info about a command, see: \`${prefix}help [command name]\``,
        !message.guild
          ? "\nThere are commands that are only usable in servers." +
            " If you would like to see them, please trigger this command in a server."
          : "",
      ]);
    if (process.env.HOMEPAGE) {
      embed.setURL(process.env.HOMEPAGE + "commands");
    }

    for (const [category, commands] of this.handler.categories) {
      const title = this.titles.get(category) || "General";

      if (
        (!message.guild && category === "admin") ||
        (message.guild &&
          category === "admin" &&
          !(message.channel as TextChannel)
            .permissionsFor(message.member)
            .has("MANAGE_GUILD"))
      ) {
        continue;
      }

      const publicCommands =
        this.client.isOwner(message.author) && !pub
          ? commands
          : commands.filter((c) => !c.ownerOnly);
      let parentCommands = publicCommands.filter((c) =>
        Boolean(c.aliases && c.aliases.length)
      );

      if (!message.guild)
        parentCommands = parentCommands.filter((c) => c.channel !== "guild");
      if (title && parentCommands.size)
        embed.addField(
          title,
          parentCommands.map((c) => `\`${c.aliases[0]}\``).join(", ")
        );
    }

    embed.fields = embed.fields.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );

    return message.util.send(embed);
  }
}

// if (Module.config.homePage) {
//   embed.setURL(Module.config.homePage + "commands");
// }
