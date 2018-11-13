'use strict';

const config = require('../common/config');
const logger = require('../common/logger');
const RedisClient = require('../common/redis.client');

const context = {
  client: null
};

const del = (id) => {
  if (!context.client) {
    return Promise.reject(new Error('Device redis connect null'));
  }
  return context.client.del(id);
};

const init = () => {
  logger.notice('Device redis connection start');
  try {
    if (context.client) {
      context.client.disconnect(1);
    }

    const conf = config.redis.dl;
    context.client = new RedisClient(conf.host, conf.port, conf.opts);
    context.client.connect();
  } catch (err) {
    logger.error(err);
  }
  logger.notice('Device redis connection end');
};

init();

module.exports = {
  reload: init,
  del
};
