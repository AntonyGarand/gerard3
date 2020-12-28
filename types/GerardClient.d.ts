import { Logger } from "log4js";

export interface IGerardClient {
  logger: Logger;
}

declare module "discord-akairo" {
  interface AkairoClient extends IGerardClient {}
}
