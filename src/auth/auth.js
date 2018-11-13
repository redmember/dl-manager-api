'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../common/config');
const session = require('../helper/session');

const dlkey = Buffer.from(config.auth.service.secret.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const userkey = Buffer.from(config.auth.auth0.secret.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

const dlVerify = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, dlkey, (err, result) => {
      if (err) {
        return reject(createError(401, err, { log: 'notice' }));
      }
      if (!result.iss || !result.sub) {
        return reject(createError(401, 'JsonWebTokenFormat - Service auth not found iss or sub'));
      }
      if (result.iss !== config.auth.service.iss) {
        return reject(createError(401, 'JsonWebTokenFormat - Service auth invalid jwt format'));
      }
      resolve(result);
    });
  });
};

const userVerify = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, userkey, (err, result) => {
      if (err) {
        return reject(createError(401, err, { log: 'notice' }));
      }
      resolve(result);
    });
  });
};

const find = (req, messagePrefix) => {
  if (req.query.access_token) {
    const tmp = req.query.access_token.split('/api');
    return tmp[0];
  }

  if (!req.headers.authorization) {
    throw createError(401, `${messagePrefix} token not found`);
  }

  const match = /([Bb][Ee][Aa][Rr][Ee][Rr]) +(.*)$/.exec(req.headers.authorization);
  if (match && match[2]) {
    const tmp = match[2].split('/api');
    return tmp[0];
  } else {
    throw createError(401, `${messagePrefix} token not found`);
  }
};

const dl = async (req, res, next) => {
  const token = find(req, 'Dl');
  const result = await dlVerify(token);
  req.user = result;
  req.user.access_token = token;
  return next();
};

const user = async (req, res, next) => {
  const token = find(req, 'User');
  const result = await userVerify(token);
  const userInfo = await session.find(result.sub);
  req.user = userInfo;
  return next();
};

module.exports = {
  dl,
  user
};
