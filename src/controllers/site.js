'use strict';

const member = require('../models/member');
const dealer = require('../models/dealer');
const site = require('../models/site');
const qhelper = require('../helper/filter');
const dlcache = require('../helper/dl');
const permission = require('../helper/permission');
const createError = require('http-errors');

/* eslint camelcase: ["error", {ignoreDestructuring: true}] */
/* eslint-disable camelcase */

const sendJson = (res, json, code = 200) => {
  res.status(code).json(json);
};

/**
 * @api {put} /v1/dl/dealers/:dealer_id/sites/:site_id Enable deep learning
 * @apiVersion 1.0.0
 * @apiGroup Site
 * @apiName Update
 * @apiParam {Number}     dealer_id 딜러 아이디
 * @apiParam {Number}     site_id   사이트 아이디
 * @apiParam {Number=0,1} enable    사용유무
 * @apiPermission dealer
 * @apiUse CommonUpdateResponse
 */
const update = async (req, res, next) => {
  const { dealer_id, site_id } = req.params;
  const { user_id } = req.user;
  const { enable } = req.body;

  if (!dealer_id || !site_id) {
    return next(createError(400, 'Bad request'));
  }

  await permission.isDealerOwner(dealer_id, user_id);
  await member.findByDealerIdAndId(dealer_id, user_id);
  await dealer.site.findByDealerIdAndSiteId(dealer_id, site_id);

  if (enable) {
    const data = { site_id, enable: 1 };
    await site.create(data);
  } else {
    await site.del({ site_id });
  }
  await dlcache.del(site_id);

  sendJson(res, { code: 200, message: 'success' });
};

/**
 * @api {get} /v1/dl/dealers/:dealer_id/sites Get all site
 * @apiVersion 1.0.0
 * @apiGroup Site
 * @apiName List
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiPermission dealer
 * @apiUse CommonReadResponse
 */
const read = async (req, res, next) => {
  const { dealer_id } = req.params;
  const { user_id } = req.user;

  await member.findByDealerIdAndId(dealer_id, user_id);

  const query = {};
  query.filter = [{ 'dealer_site.partner_id': dealer_id }];
  query.fields = 'site.*, IF(ISNULL(site_dl.site_id), 0, 1) AS enable_dl';
  query.join = [
    'INNER JOIN site ON dealer_site.site_id = site.site_id',
    'LEFT JOIN site_dl ON site.site_id = site_dl.site_id'
  ];
  qhelper.getQueryOptions(query, req.query);

  const results = await dealer.site.read(query);
  sendJson(res, results);
};

module.exports = {
  read,
  update
};
