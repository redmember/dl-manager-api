'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../common/config');
const session = require('../helper/session');

const key = Buffer.from(config.auth.secret.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const verify = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, (err, result) => {
      if (err) {
        return reject(createError(401, err, { log: 'notice' }));
      }
      resolve(result);
    });
  });
};

const find = (req, messagePrefix) => {
  if (req.query.access_token) {
    return req.query.access_token;
  }

  if (!req.headers.authorization) {
    throw createError(401, `${messagePrefix} token not found`);
  }

  const match = /([Bb][Ee][Aa][Rr][Ee][Rr]) +(.*)$/.exec(req.headers.authorization);
  if (match && match[2]) {
    return match[2];
  } else {
    throw createError(401, `${messagePrefix} token not found`);
  }
};

const test = async (req, res, next) => {
  const token = find(req, 'User');
  const result = await verify(token);
  const userInfo = await session.find(result.sub);
  userInfo.authToken = result;
  req.user = userInfo;
  return next();
};

module.exports = {
  test
};
