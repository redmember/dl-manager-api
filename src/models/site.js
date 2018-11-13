'use strict';

const createError = require('http-errors');
const db = require('./database');
const device = require('./device');
const tableName = 'site_dl';

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
    const query = {};
    query.filter = { 'site_dl.site_id': id };
    query.fields = 'site.*';
    query.join = 'INNER JOIN site ON site_dl.site_id = site.site_id';

    db.read(tableName, query)
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${id} site not found`));
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
  find,
  device
};
