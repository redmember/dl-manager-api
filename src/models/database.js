'use strict';

const mysql = require('mysql');
const dbconf = require('../common/config').database;
const logger = require('../common/logger');

const readPool = mysql.createPool(dbconf.read);
const writePool = mysql.createPool(dbconf.write);

const parseWhere = (filter) => {
  let objs = [];

  if (filter instanceof Array) {
    if (filter.length === 0) {
      return '';
    }
    objs = filter;
  } else {
    objs.push(filter);
  }

  let where = '';
  for (let i = 0; i < objs.length; i++) {
    const obj = objs[i];
    if (typeof obj === 'string') {
      where += ' ' + obj;
      continue;
    }

    let field;
    let value;

    let cop = obj._cop || '=';
    let lop = obj._lop || 'AND';

    for (let key in obj) {
      if (key === '_cop' || key === '_lop') {
        continue;
      }

      field = key;
      if (typeof obj[key] === 'string') {
        value = mysql.escape(obj[key]);
      } else if (Array.isArray(obj[key])) {
        value = `(${obj[key].join(',')})`;
        cop = 'IN';
      } else {
        value = obj[key];
      }
      break;
    }

    cop = ' ' + cop + ' ';
    lop = ' ' + lop + ' ';
    if (where.length > 0) {
      where += lop + field + cop + value;
    } else {
      where = field + cop + value;
    }
  }
  return where;
};

const selectHelper = (obj) => {
  let where = '';

  if (typeof obj !== 'object') {
    return null;
  }

  if (typeof obj.join === 'string') {
    where += ' ' + obj.join;
  }

  if (typeof obj.join === 'object') {
    where += ' ' + obj.join.join(' ');
  }

  if (obj.filter) {
    if (typeof obj.filter === 'string') {
      where += ' WHERE ' + obj.filter;
    } else if (typeof obj.filter === 'object') {
      if (obj.filter instanceof Array) {
        if (obj.filter.length > 0) {
          where += ' WHERE ' + parseWhere(obj.filter);
        }
      } else {
        where += ' WHERE ' + parseWhere(obj.filter);
      }
    }
  }

  if (obj.groupby) {
    where += ' GROUP BY ' + obj.groupby;
  }

  if (obj.sort) {
    where += ' ORDER BY ' + obj.sort;
    if (obj.dir) {
      where += ' ' + obj.dir;
    } else {
      where += ' ASC';
    }
  }

  if (obj.limit) {
    if (obj.offset) {
      where += ' LIMIT ' + obj.offset + ',' + obj.limit;
    } else {
      where += ' LIMIT ' + obj.limit;
    }
  }
  return where;
};

const insertHelper = (obj) => {
  let fields = [];
  let values = [];
  let objs = [];

  if (obj instanceof Array) {
    objs = obj;
  } else {
    objs.push(obj);
  }

  for (let i = 0; i < objs.length; i++) {
    let value = [];
    let item = objs[i];

    for (let prop in item) {
      if (i === 0) {
        fields.push(prop);
      }

      if (typeof item[prop] === 'number') {
        value.push(item[prop]);
      } else {
        value.push(mysql.escape(item[prop]));
      }
    }
    value = '(' + value.join(',') + ')';
    values.push(value);
  }
  return { fields: fields.join(','), values: values.join(',') };
};

const updateHelper = (obj) => {
  let values = '';

  for (let prop in obj) {
    if (values.length > 0) {
      values += ', ';
    }

    if (typeof obj[prop] === 'number') {
      values += prop + '=' + obj[prop];
    } else {
      values += prop + '=' + mysql.escape(obj[prop]);
    }
  }
  return values;
};

const querycb = (sql, cb, dbpool) => {
  if (sql.length <= 0) {
    return cb(new Error('Empty query'), null); // eslint-disable-line
  }

  logger.info(sql);
  if (!dbpool) {
    dbpool = writePool;
  }

  dbpool.getConnection((err, con) => {
    if (err) {
      logger.warning(err);
      return cb(err, null);
    }
    con.query(sql, (err, results) => {
      con.release();
      if (err) {
        if (err.code === 'ER_OPTION_PREVENTS_STATEMENT') {
          logger.error('database reconnect');
          con.changeUser({ user: 'test01!!!' }, err => logger.error(err));
        }
        logger.warning(sql);
        logger.warning(err);
      }
      cb(err, results);
    });
  });
};

const query = (sql, dbpool, dbcon) => {
  if (typeof dbcon === 'function') {
    return querycb(sql, dbcon, dbpool);
  }

  return new Promise((resolve, reject) => {
    if (!sql || sql.length <= 0) {
      return reject(new Error('Empty query'));
    }
    logger.info(sql);

    if (dbcon) {
      return dbcon.query(sql, (err, results) => {
        if (err) {
          logger.warning(err);
          return reject(err);
        } else {
          return resolve(results);
        }
      });
    }

    if (!dbpool) {
      dbpool = writePool;
    }

    dbpool.getConnection((err, con) => {
      if (err) {
        logger.warning(err);
        return reject(err);
      }
      con.query(sql, (err, results) => {
        con.release();
        if (err) {
          if (err.code === 'ER_OPTION_PREVENTS_STATEMENT') {
            /* 위에러 코드 일경우 재연결 할 방법이
             * 이상한 사용자를 설정하고 다시 접속하게 한다. */
            logger.error('database reconnect');
            con.changeUser({ user: 'test01!!!' }, err => logger.error(err));
          }
          logger.warning(sql);
          logger.warning(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });
};

const create = (table, obj, dbcon, opts) => {
  if (typeof obj === 'string') {
    return query(obj, writePool, dbcon);
  }

  const ret = insertHelper(obj);
  if (!ret || !ret.values || !ret.fields) {
    return Promise.reject(new Error('Invalid create values'));
  }

  if (typeof dbcon === 'string') {
    opts = dbcon;
    dbcon = null;
  }
  if (!opts) {
    opts = '';
  }

  const sql = `INSERT INTO ${table} (${ret.fields}) VALUES ${ret.values} ${opts}`;
  return query(sql, writePool, dbcon);
};

const read = (table, queryInfo, dbcon) => {
  let fields = '*';

  if (typeof queryInfo === 'string') {
    return query(queryInfo, null, dbcon);
  }

  if (typeof queryInfo.fields === 'string') {
    fields = queryInfo.fields;
  }
  if (typeof queryInfo.fields === 'object') {
    fields = queryInfo.fields.join();
  }

  if (typeof queryInfo.limit === 'undefined' || queryInfo.limit > dbconf.options.selectLimit) {
    queryInfo.limit = dbconf.options.selectLimit;
  }

  let sql = `SELECT ${fields} FROM ${table}`;
  const where = selectHelper(queryInfo);
  if (where) {
    sql += where;
  }

  return query(sql, queryInfo.sync ? writePool : readPool, dbcon);
};

const update = (table, obj, filter, dbcon) => {
  let where;
  let values;

  if (typeof obj === 'string') {
    values = obj;
  } else {
    values = updateHelper(obj);
  }

  if (!values) {
    return Promise.reject(new Error('Invalid update values'));
  }

  if (typeof filter === 'string') {
    where = filter;
  } else if (typeof filter === 'object') {
    where = parseWhere(filter);
  }

  if (!where) {
    return Promise.reject(new Error('Invalid update where condition'));
  }

  const sql = `UPDATE ${table} SET ${values} WHERE ${where}`;
  return query(sql, writePool, dbcon);
};

const del = (table, filter, dbcon) => {
  let where;

  if (typeof filter === 'string') {
    where = filter;
  } else if (typeof filter === 'object') {
    where = parseWhere(filter);
  }

  if (!where) {
    return Promise.reject(new Error('Invalid delete where condition'));
  }

  const sql = `DELETE FROM ${table} WHERE ${where}`;
  return query(sql, writePool, dbcon);
};

const connect = () => {
  return new Promise((resolve, reject) => {
    const con = mysql.createConnection(dbconf.write);
    con.connect(err => {
      if (err) {
        reject(err);
      } else {
        resolve(con);
      }
    });
  });
};

const begin = (con) => {
  return new Promise((resolve, reject) => {
    if (!con) {
      return reject(new Error('Invalid connection'));
    }
    con.beginTransaction(err => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const end = (con) => {
  return new Promise((resolve, reject) => {
    if (con) {
      con.end();
    }
    resolve(true);
  });
};

const rollback = (con) => {
  return new Promise((resolve, reject) => {
    con.rollback(() => {
      resolve(true);
    });
  });
};

const commit = (con) => {
  return new Promise((resolve, reject) => {
    con.commit(err => {
      if (err) {
        con.rollback(() => {
          reject(err);
        });
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  connect,
  commit,
  begin,
  rollback,
  end,
  tconnect: connect,
  tcommit: commit,
  tbegin: begin,
  trollback: rollback,
  tend: end,
  query,
  create,
  read,
  update,
  del,
  delete: del,
  escape: mysql.escape,
  mescape: mysql.escape
};
