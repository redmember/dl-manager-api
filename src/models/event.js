'use strict';

const createError = require('http-errors');
const db = require('./database');
const tableName = 'device_event';

const create = (data, cb) => {
  return db.create(tableName, data, cb);
};

const read = (query, cb) => {
  return db.read(tableName, query, cb);
};

const update = (data, where, cb) => {
  return db.update(tableName, data, where, cb);
};

const del = (where, cb) => {
  return db.delete(tableName, where, cb);
};

const find = (id) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: { event_id: id } })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} event not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  create,
  read,
  update,
  del,
  find
};
