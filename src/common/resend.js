'use strict';

const logger = require('./logger');
const createError = require('http-errors');

const notFoundHandle = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

const logHandle = (err, req, res, next) => {
  next(err);
};

const errorHandle = (err, req, res, next) => {
  if (!err.status) {
    err.status = err.statusCode || 500;
  }

  res.status(err.status).json({ message: err.message || 'Error' });

  if (err.log && typeof logger[err.log] === 'function') {
    logger[err.log](err);
  }

  if (!(err instanceof createError.HttpError)) {
    logger.error(err);
  }
};

module.exports = {
  notFoundHandle,
  logHandle,
  errorHandle
};
