import * as dotenv from 'dotenv';
dotenv.config();

import * as log4js from 'log4js';
const logger = log4js.getLogger();

log4js.configure({
  appenders: { 'out': { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: process.env.LOG_LEVEL || 'debug' } }
});
