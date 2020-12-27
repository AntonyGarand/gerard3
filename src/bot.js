import dotenv from 'dotenv';
dotenv.config();
import './setup.js';

import * as Akairo from 'discord-akairo';
import log4js from 'log4js';
const logger = log4js.getLogger();

const { AkairoClient } = Akairo.default;

logger.debug('Starting Gerard!');

class GerardClient extends AkairoClient {
    constructor() {
        super({
            // Options for Akairo go here.
        }, {
            // Options for discord.js goes here.
        });
    }
}

const client = new GerardClient();
client.login(process.env.DISCORD_TOKEN);