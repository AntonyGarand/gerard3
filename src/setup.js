process.env.ADMIN_IDS=process.env.ADMIN_IDS?.split(',') || [];
process.env.OWNER_IDS=process.env.OWNER_IDS?.split(',') || [];

import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL
logger.debug("Some debug messages");