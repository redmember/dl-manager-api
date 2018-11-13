'use strict';

const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const wlogger = new winston.Logger();

const logger = () => {
  wlogger.exitOnError = false;
  if (config.http.logger.type === 'File') {
    const dirname = path.dirname(config.http.logger.File.filename);
    if (!fs.existsSync(dirname)) {
      fs.ensureDirSync(dirname);
    }

    let prefix = config.http.logger.prefix;
    if (process.env.pm_id) {
      prefix = config.http.logger.prefix + process.env.pm_id + '-';
    }
    config.http.logger.File.filename = dirname + '/' + prefix + path.basename(config.http.logger.File.filename);
  }

  wlogger.add(winston.transports[config.http.logger.type], config.http.logger[config.http.logger.type]);
  return expressWinston.logger({ winstonInstance: wlogger });
};

module.exports = logger;
