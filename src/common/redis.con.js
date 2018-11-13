'use strict';

const redis = require('redis');
const logger = require('./logger');

class RedisCon {
  constructor (host = '127.0.0.1', port = 6379, opts = {}) {
    this.state = 0;
    this.client = null;
    this.host = host;
    this.port = port;
    this.opts = opts;
  }

  connect () {
    if (this.client !== null) {
      throw new Error('Already connect exist');
    }

    logger.notice(`host: ${this.host} port: ${this.port} opts: ${JSON.stringify(this.opts)}`);

    this.client = redis.createClient(this.port, this.host, this.opts);
    this.client.on('reconnecting', () => {
      logger.notice(`Reconnecting ${this.host} ${this.port} ${JSON.stringify(this.opts)}`);
    });

    this.client.on('error', (err) => {
      this.state = 0;
      logger.error(err);
    });

    this.client.on('connect', () => {
      logger.notice(`Connect ${this.host} ${this.port} ${JSON.stringify(this.opts)}`);
      this.state = 1;
    });

    this.client.on('ready', () => {
      logger.notice(`Ready ${this.host} ${this.port} ${JSON.stringify(this.opts)}`);
    });

    this.client.on('end', () => {
      this.state = 0;
      logger.notice(`End ${this.host} ${this.port} ${JSON.stringify(this.opts)}`);
    });
  }

  isConnected () {
    return this.state === 1;
  }

  disconnect (force) {
    this.state = 0;
    if (this.client === null) {
      return;
    }

    if (force === 1) {
      this.client.end(true);
    } else {
      this.client.quit();
    }
  }
}

module.exports = RedisCon;
