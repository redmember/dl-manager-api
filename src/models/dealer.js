'use strict';

const createError = require('http-errors');
const db = require('./database');
const site = require('./dealer.site');
const member = require('./dealer.member');
const tableName = 'dealer';

const read = (query, cb) => {
  return db.read(tableName, query, cb);
};

const find = (id) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: { dealer_id: id } })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} dealer not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  read,
  find,
  site,
  member
};
