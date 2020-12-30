import { BrawlhallaApi } from "brawlhalla-api-ts";

export const bhApi: BrawlhallaApi = new BrawlhallaApi(
  process.env.BRAWLHALLA_TOKEN,
  process.env.STEAM_TOKEN
);
export default bhApi;
