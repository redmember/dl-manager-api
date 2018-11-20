'use strict';

const multiparty = require('multiparty');
const moment = require('moment');
const model = require('../models/dl');
const logger = require('../common/logger');

/* eslint camelcase: ["error", {ignoreDestructuring: true}] */
/* eslint-disable camelcase */

const sendJson = (res, str, code = 200) => {
  res.status(code).json(str);
};

const getFormData = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    const chunkArray = [];
    let jsonStr;

    form.on('field', (name, value) => {
    });

    form.on('part', part => {
      if (!part.filename) {
        part.resume();
      }
      if (part.headers['content-type'] !== 'application/json') {
        part.resume();
      }

      part.on('end', chunk => {
        jsonStr = Buffer.concat(chunkArray).toString();
      });
      part.on('data', chunk => {
        chunkArray.push(chunk);
      });
      part.on('error', err => {
        reject(err);
      });
    });

    form.on('close', () => {
      resolve(jsonStr);
    });

    form.parse(req);
  });
};

/**
 * @api {post} /v1/dl/multipart_result Create a dl multipart result
 * @apiVersion 1.0.0
 * @apiGroup DL
 * @apiName CreateMulti
 * @apiPermission api
 * @apiUse CommonReadResponse
 */
const createMultipart = async (req, res, next) => {
  sendJson(res, { code: 200, message: 'success' });

  try {
    const result = await getFormData(req);
    const dlInfo = JSON.parse(result);
    const data = {
      site_id: req.user.metadata.siteId,
      device_id: req.user.metadata.deviceId,
      event_id: req.user.metadata.eventId,
      meta: JSON.stringify(dlInfo.detected_lists),
      found: dlInfo.found ? 1 : 0,
      success: dlInfo.success ? 1 : 0,
      request_time: req.user.metadata.requestTime,
      response_time: moment().unix()
    };
    logger.notice(`req ${data.request_time} res ${data.response_time} runtime ${data.response_time - data.request_time} second`);
    await model.create(data);
  } catch (err) {
    logger.error(err);
  }
};

/**
 * @api {post} /v1/dl/result Create a dl result
 * @apiVersion 1.0.0
 * @apiGroup DL
 * @apiName Create
 * @apiPermission api
 * @apiUse CommonReadResponse
 */
const create = async (req, res, next) => {
  sendJson(res, { code: 200, message: 'success' });
};

module.exports = {
  create,
  createMultipart
};
