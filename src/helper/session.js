'use strict';

const user = require('../models/user');
const config = require('../common/config');
const logger = require('../common/logger');
const RedisClient = require('../common/redis.client');

const context = {
  client: null
};

const get = (id) => {
  if (!context.client) {
    return Promise.reject(new Error('Session redis connect null'));
  }
  return context.client.get(id, 1);
};

const set = (id, data, ttl = 86400) => {
  if (!context.client) {
    return Promise.reject(new Error('Session redis connect null'));
  }
  return context.client.set(id, JSON.stringify(data), ttl);
};

const del = (id) => {
  if (!context.client) {
    return Promise.reject(new Error('Session redis connect null'));
  }
  return context.client.del(id);
};

const find = async id => {
  if (!context.client) {
    throw new Error('Session redis connect null');
  }

  let userInfo = await get(id);
  if (userInfo) {
    return JSON.parse(userInfo);
  }

  userInfo = await user.findByProviderId(id);
  if (!userInfo) {
    throw new Error('User not found');
  }

  try {
    await set(id, userInfo);
  } catch (err) {
    logger.error(err);
  }
  return userInfo;
};

const init = () => {
  logger.notice('Session redis connection start');
  try {
    if (context.client) {
      context.client.disconnect(1);
    }

    const conf = config.redis.user;
    context.client = new RedisClient(conf.host, conf.port, conf.opts);
    context.client.connect();
  } catch (err) {
    logger.error(err);
  }
  logger.notice('Session redis connection end');
};

init();

module.exports = {
  reload: init,
  get,
  set,
  del,
  find
};
