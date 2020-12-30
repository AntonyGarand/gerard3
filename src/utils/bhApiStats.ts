import { LegendStats, PlayerStats, WeaponStats } from "brawlhalla-api-ts";

export interface PlayerLegendStats {
  mostUsed: LegendStats;
  highestWinrate: { legend: LegendStats; winrate: number };
  highestDPS: { legend: LegendStats; dps: number };
  lowestTTK: { legend: LegendStats; ttk: number };
}
export interface PlayerWeaponStats {
  mostUsed: WeaponStats;
  highestWinrate: { weapon: WeaponStats; winrate: number };
  highestDPS: { weapon: WeaponStats; dps: number };
  lowestTTK: { weapon: WeaponStats; ttk: number };
}

export function getBestLegendStats(stats: PlayerStats): PlayerLegendStats {
  const validLegends = stats.legendStats.filter((l) => l.games >= 20);
  const mostUsed = validLegends.sort((a, b) => b.games - a.games)[0];

  const highestWinrate = validLegends
    .map((legend) => {
      const winrate = getWinRate(legend);
      return { legend, winrate };
    })
    .sort((a, b) => b.winrate - a.winrate)[0];

  const highestDPS = validLegends
    .map((legend) => {
      const dps = getDPS(legend);
      return { legend, dps };
    })
    .sort((a, b) => b.dps - a.dps)[0];

  const lowestTTK = validLegends
    .map((legend) => {
      const ttk = getTTK(legend);
      return { legend, ttk };
    })
    .sort((a, b) => a.ttk - b.ttk)[0];

  return {
    mostUsed,
    highestWinrate,
    highestDPS,
    lowestTTK,
  };
}

export function getBestWeaponStats(stats: PlayerStats): PlayerWeaponStats {
  const validWeapons = stats.weaponStats.filter(
    (w) => w.games >= 20 && w.weapon.name !== "Unarmed"
  );

  const mostUsed = validWeapons.sort((a, b) => b.games - a.games)[0];

  const highestWinrate = validWeapons
    .map((weapon) => {
      const winrate = getWinRate(weapon);
      return { weapon, winrate };
    })
    .sort((a, b) => b.winrate - a.winrate)[0];

  const highestDPS = validWeapons
    .map((weapon) => {
      const dps = getDPS(weapon);
      return { weapon, dps };
    })
    .sort((a, b) => b.dps - a.dps)[0];

  const lowestTTK = validWeapons
    .map((weapon) => {
      const ttk = getTTK(weapon);
      return { weapon, ttk };
    })
    .sort((a, b) => a.ttk - b.ttk)[0];

  return {
    mostUsed,
    highestWinrate,
    highestDPS,
    lowestTTK,
  };
}

export function getWinRate(item: LegendStats | WeaponStats): number {
  return item.wins / item.games;
}

export function getDPS(item: LegendStats | WeaponStats): number {
  return item.damageDealt / item.matchTime;
}
export function getTTK(item: LegendStats | WeaponStats): number {
  return item.matchTime / item.kos;
}
