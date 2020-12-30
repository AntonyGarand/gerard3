import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import {
  BH_REGION_NICE_NAME,
  BRAWLHALLA_REGIONS,
  convertRegion,
  TRegion,
} from "@utils/bhRegions";

export default class BrawlhallaPingTestCommand extends Command {
  constructor() {
    super("pingtest", {
      aliases: ["pingtest"],
      description: {
        usage: "",
        examples: ["use"],
        content:
          "Retrieves the ping command to verify your ping to the different servers.",
      },
      args: [
        {
          id: "region",
          type: (message, phrase): TRegion | "all" => {
            return convertRegion(phrase) || "all";
          },
          default: "all",
        },
      ],
    });
  }

  public async exec(message: Message, { region }: { region: TRegion | "all" }) {
    let embed = new MessageEmbed()
      .setTitle("Ping Test Command for Brawlhalla Servers")
      .setDescription(
        "Run within the Windows console or your favorite terminal!"
      );

    if (region === "all") {
      BRAWLHALLA_REGIONS.forEach((r) => {
        embed.addField(
          BH_REGION_NICE_NAME[r],
          `\`ping -n 30 pingtest-${r}.brawlhalla.com\``
        );
      });
    } else {
      embed.addField(
        BH_REGION_NICE_NAME[region],
        `\`ping -n 30 pingtest-${region}.brawlhalla.com\``
      );
    }
    return message.reply({ embed });
  }
}
