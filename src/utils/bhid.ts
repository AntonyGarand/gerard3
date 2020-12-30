import { Message } from "discord.js";

import bhApi from "@utils/bhApi";
import { logger } from "@utils/logger";
import { User } from "discord.js";

export function bhidResolver(message: Message, phrase: string): number | null {
  if (message.mentions.users.size) {
    const mentionned = message.mentions.users.first();
    logger.debug(mentionned.username);
    return getBhidFromUser(mentionned);
  }
  const maybeBhid = parseInt(phrase);
  if (!isNaN(maybeBhid)) {
    return maybeBhid;
  }

  return null;
}

export function getBhidFromUser(user: User): number {
  return 1;
  throw new Error("Todo");
}
