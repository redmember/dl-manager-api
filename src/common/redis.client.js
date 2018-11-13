'use strict';

const RedisCon = require('./redis.con');

class RedisClient extends RedisCon {
  constructor (host = '127.0.0.1', port = 6379, opts = {}) {
    super(host, port, opts);
  }

  set (key, value, ttl = 0) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }

      if (ttl > 0) {
        this.client.setex(key, ttl, value, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      } else {
        this.client.set(key, value, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }
    });
  }

  get (key, isEmptyNoError = 0) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }

      this.client.get(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result && isEmptyNoError === 0) {
          return reject(new Error(`404|NotFound-${key}`));
        }
        resolve(result);
      });
    });
  }

  del (key) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }

      this.client.del(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  getttl (key) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }

      this.client.ttl(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }

  keys (key) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }
      this.client.keys(key, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  incrAsync (key, ttl = 0) {
    return new Promise((resolve, reject) => {
      if (this.state !== 1) {
        return reject(new Error('NotConnected'));
      }
      this.client.incr(key, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (ttl) {
          this.client.expire(key, ttl);
        }
        resolve(result);
      });
    });
  }
}

module.exports = RedisClient;
