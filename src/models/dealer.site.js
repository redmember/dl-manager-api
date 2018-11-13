'use strict';

const createError = require('http-errors');
const db = require('./database');
const tableName = 'dealer_site';

const read = (query, cb) => {
  return db.read(tableName, query, cb);
};

const findByDealerIdAndSiteId = (dealerId, siteId) => {
  return new Promise((resolve, reject) => {
    db.read(tableName, { filter: [{ partner_id: dealerId }, { site_id: siteId }] })
      .then(results => {
        if (results.length !== 1) {
          reject(createError(404, `ID ${dealerId}-${siteId} dealer site not found`));
        } else {
          resolve(results[0]);
        }
      })
      .catch(err => reject(err));
  });
};

module.exports = {
  read,
  findByDealerIdAndSiteId
};
