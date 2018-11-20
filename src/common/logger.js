'use strict';

const winston = require('winston');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const logger = new winston.Logger();

logger.exitOnError = false;
logger.setLevels(winston.config.syslog.levels);

if (config.logger.type === 'File') {
  const dirname = path.dirname(config.logger.File.filename);
  if (!fs.existsSync(dirname)) {
    fs.ensureDirSync(dirname);
  }

  let prefix = config.logger.prefix;
  if (process.env.pm_id) {
    prefix = config.logger.prefix + process.env.pm_id + '-';
  }

  config.logger.File.filename = dirname + '/' + prefix + path.basename(config.logger.File.filename);
}

logger.add(winston.transports[config.logger.type], config.logger[config.logger.type]);
logger.info(config.logger.type, 'logging enable');
logger.info('Node Enviroment', process.env.NODE_ENV);

module.exports = logger;
