export interface IGerardClient {
  test(): void;
}

declare module "discord-akairo" {
  interface AkairoClient extends IGerardClient {}
}
