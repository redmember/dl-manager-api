'use strict';

const createError = require('http-errors');
const db = require('./database');
const tableName = 'user';

const find = (id) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: { event_id: id } })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} user not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

const findByProviderId = (id) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: { provider_id: id } })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} provider user not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  find,
  findByProviderId
};
