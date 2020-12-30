import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { logger } from "@utils/logger";
import { Argument } from "discord-akairo";
import bhApi from "@utils/bhApi";
import { MessageEmbed } from "discord.js";
import { getBestLegendStats, getBestWeaponStats } from "@utils/bhApiStats";

export default class BrawlhallaStatsCommand extends Command {
  constructor() {
    super("stats", {
      aliases: ["stats", "bhstats"],
      description: {
        usage: "([bhid | @User | name])",
        examples: ["", "@Anyny0", "931071", "Boomie"],
        content:
          "Retrieves stats for yourself, a mentioned user (if they have `claim`ed their profile) or a given Brawlhalla ID.",
      },
      args: [
        {
          id: "target",
          type: Argument.union("bhid", "string"),
          default: null,
        },
      ],
    });
  }

  public async exec(message: Message, { target }: { target: number | string }) {
    try {
      if (typeof target === "number") {
        const embed = await this.buildSinglePlayerStatsEmbed(target);
        message.channel.send({ embed });
      } else {
        return await this.buildMultiplePlayerStatsEmbed(target);
      }
    } catch (err) {
      logger.error(err);
    }
  }

  public async buildSinglePlayerStatsEmbed(bhid: number) {
    const stats = await bhApi.getPlayerStats(bhid);
    const legends = getBestLegendStats(stats);
    const weapons = getBestWeaponStats(stats);

    // Todo: Verified
    const embed = new MessageEmbed()
      .setTitle(`Brawlhalla Stats for ${stats.name}`)
      .addField(
        "Name",
        `**[${stats.name}](https://brawldb.com/player/stats/${stats.brawlhallaID})**` +
          (stats.clan
            ? `\n< [${stats.clan.name}](https://brawldb.com/clan/info/${stats.clan.id}) >`
            : ""),
        true
      )
      .addField(
        "Overall",
        [
          `${stats.wins} Wins | ${stats.games - stats.wins} Defeats | ${
            stats.games
          } Games`,
          `${((100 * stats.wins) / stats.games).toFixed(1)}% Winrate`,
        ].join("\n"),
        true
      )
      .addField(
        "Legends (20 game minimum)",
        [
          `**Most Used:** ${legends.mostUsed?.legend.name || "None"}`,
          `**Highest Winrate:** ${
            legends.highestWinrate
              ? legends.highestWinrate.legend.legend.name +
                ` (${(100 * legends.highestWinrate.winrate).toFixed(1)}%)`
              : "None"
          }`,
          `**Highest avg DPS:** ${
            legends.highestDPS
              ? legends.highestDPS.legend.legend.name +
                ` (${legends.highestDPS.dps.toFixed(2)})`
              : "None"
          }`,
          `**Shortest avg TTK:** ${
            legends.lowestTTK
              ? legends.lowestTTK.legend.legend.name +
                ` (${legends.lowestTTK.ttk.toFixed(1)}s)`
              : "None"
          }`,
        ].join("\n"),
        false
      )
      .addField(
        "Weapons (20 game minimum)",
        [
          `**Most Used:** ${weapons.mostUsed?.weapon.name || "None"}`,
          `**Highest Winrate:** ${
            weapons.highestWinrate
              ? weapons.highestWinrate.weapon.weapon.name +
                ` (${(100 * weapons.highestWinrate.winrate).toFixed(1)}%)`
              : "None"
          }`,
          `**Highest avg DPS:** ${
            weapons.highestDPS
              ? weapons.highestDPS.weapon.weapon.name +
                ` (${weapons.highestDPS.dps.toFixed(2)})`
              : "None"
          }`,
          `**Shortest avg TTK:** ${
            weapons.lowestTTK
              ? weapons.lowestTTK.weapon.weapon.name +
                ` (${weapons.lowestTTK.ttk.toFixed(1)}s)`
              : "None"
          }`,
        ].join("\n"),
        false
      )
      // .addField(
      //   "Weapons (20 game minimum)",
      //   [
      //     "**Most Used:** " +
      //       (response.weapon.time ? response.weapon.time.name : "None"),
      //     "**Highest Winrate (Legends Using Weapon):** " +
      //       (response.weapon.wr
      //         ? `${response.weapon.wr.name} (${response.weapon.wr.value}%)`
      //         : "None"),
      //     "**Highest Avg DPS:** " +
      //       (response.weapon.dps
      //         ? `${response.weapon.dps.name} (${response.weapon.dps.value})`
      //         : "None"),
      //     "**Shortest Avg TTK:** " +
      //       (response.weapon.ttk
      //         ? `${response.weapon.ttk.name} (${response.weapon.ttk.value}s)`
      //         : "None"),
      //   ].join("\n"),
      //   true
      // )
      .setURL(`https://brawldb.com/player/stats/${stats.brawlhallaID}`);

    return embed;
  }

  public buildMultiplePlayerStatsEmbed(name: string) {}
}
