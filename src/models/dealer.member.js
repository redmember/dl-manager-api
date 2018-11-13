'use strict';

const createError = require('http-errors');
const db = require('./database');
const tableName = 'dealer_member';

const read = (query, cb) => {
  return db.read(tableName, query, cb);
};

const find = (id) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: { user_id: id } })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} member not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

const findByDealerIdAndId = (dealerId, userId) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: [{ dealer_id: dealerId }, { user_id: userId }] })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${dealerId}-${userId} dealer member not found`));
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
  findByDealerIdAndId
};
