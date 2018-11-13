'use strict';

const createError = require('http-errors');
const db = require('./database');
const tableName = 'device';

const update = (data, where, cb) => {
  return db.update(tableName, data, where, cb);
};

const find = (id) => {
  return new Promise((resolve, reject) => {
    const query = {};
    query.filter = { 'device_id': id };
    db.read(tableName, query)
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} device not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  update,
  find
};
