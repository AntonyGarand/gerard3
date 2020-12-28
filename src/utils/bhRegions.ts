type ValueOf<T> = T[keyof T];
type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export const BRAWLHALLA_REGIONS = [
  "atl",
  "cal",
  "ams",
  "sgp",
  "aus",
  "brs",
  "jpn",
] as const;

export type TRegion = typeof BRAWLHALLA_REGIONS[number];

export const BH_ALTERNATIVE_REGION_NAMES: Record<string, TRegion> = {
  use: "atl",
  "us e": "atl",
  "us-e": "atl",
  usw: "cal",
  "us w": "cal",
  "us-w": "cal",
  eu: "ams",
  sea: "sgp",
  brz: "brs",
};

export const BH_REGION_NICE_NAME: Record<TRegion, string> = {
  atl: "US East",
  cal: "US West",
  ams: "Europe",
  sgp: "Asia",
  aus: "Australia",
  brs: "Brazil",
  jpn: "Japan",
};

export function convertRegion(original: string): TRegion | null {
  if (isValidRegion(original)) {
    return original;
  } else if (BH_ALTERNATIVE_REGION_NAMES.hasOwnProperty(original)) {
    return BH_ALTERNATIVE_REGION_NAMES[original];
  } else {
    return null;
  }
}

export function isValidRegion(region: string): region is TRegion {
  // https://github.com/microsoft/TypeScript/issues/26255
  // @ts-ignore
  return (BRAWLHALLA_REGIONS as string[]).includes(region);
}
