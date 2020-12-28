import { Command } from "discord-akairo";
import { TextChannel } from "discord.js";
import { Message, MessageEmbed, Channel } from "discord.js";

export default class SayCommand extends Command {
  constructor() {
    super("say", {
      aliases: ["say", "tell"],
      description: {
        content: "Make me say something",
        usage: "[thing]",
        examples: ["help me --channel #help", "I am actually sentient"],
      },
      flags: ["-c", "--channel"],
      args: [
        {
          id: "channel",
          match: "option",
          type: "textChannel",
          flag: ["-c", "--channel"],
          default: null,
        },
        {
          id: "words",
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

  public async exec(
    message: Message,
    { words, channel }: { words: string; channel: TextChannel }
  ) {
    if (message.deletable) await message.delete();

    return message.util.send(words);
  }
}
