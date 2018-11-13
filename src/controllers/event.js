'use strict';

const member = require('../models/member');
const mDealer = require('../models/dealer');
const qhelper = require('../helper/filter');
const dl = require('../models/dl');

/* eslint camelcase: ["error", {ignoreDestructuring: true}] */
/* eslint-disable camelcase */

const sendJson = (res, json, code = 200) => {
  res.status(code).json(json);
};

/**
 * @api {get} /v1/dl/dealers/:dealer_id/events Get all event for dealer
 * @apiVersion 1.0.0
 * @apiGroup Event
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiName Dealer
 * @apiPermission dealer
 * @apiUse CommonReadResponse
 */
const dealer = async (req, res, next) => {
  const { dealer_id } = req.params;
  const { user_id } = req.user;

  await member.findByDealerIdAndId(dealer_id, user_id);

  const query = {};
  query.fields = [
    'dealer_site.site_id',
    'device.mac',
    'device.channel',
    'device.name AS device_name',
    'device.alarm_zone',
    'device_event.device_id',
    'device_event.event_id',
    'device_event.type',
    'device_event.status',
    'device_event.timestamp',
    'device_event_dl.found',
    'device_event_dl.success',
    'device_event_dl.meta',
    'device_event.created'
  ];
  query.join = [
    'INNER JOIN device_event_dl ON dealer_site.site_id = device_event_dl.site_id',
    'INNER JOIN device ON device_event_dl.device_id = device.device_id',
    'INNER JOIN device_event ON device_event_dl.event_id = device_event.event_id'
  ];
  query.filter = [{ 'dealer_site.partner_id': dealer_id }];
  qhelper.getQueryOptions(query, req.query);

  const results = await mDealer.site.read(query);
  sendJson(res, results);
};

/**
 * @api {get} /v1/dl/dealers/:dealer_id/sites/:site_id/events Get all event for site
 * @apiVersion 1.0.0
 * @apiGroup Event
 * @apiName Site
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiParam {Number} site_id   사이트 아이디
 * @apiPermission dealer
 * @apiUse CommonReadResponse
 */
const site = async (req, res, next) => {
  const { dealer_id, site_id } = req.params;
  const { user_id } = req.user;

  await member.findByDealerIdAndId(dealer_id, user_id);
  await mDealer.site.findByDealerIdAndSiteId(dealer_id, site_id);

  const query = {};
  query.fields = [
    'device_event_dl.site_id',
    'device.mac',
    'device.channel',
    'device.name AS device_name',
    'device.alarm_zone',
    'device_event.device_id',
    'device_event.event_id',
    'device_event.type',
    'device_event.status',
    'device_event.timestamp',
    'device_event_dl.found',
    'device_event_dl.success',
    'device_event_dl.meta',
    'device_event.created'
  ];
  query.join = [
    'INNER JOIN device ON device_event_dl.device_id = device.device_id',
    'INNER JOIN device_event ON device_event_dl.event_id = device_event.event_id'
  ];
  query.filter = [{ 'device_event_dl.site_id': site_id }];
  qhelper.getQueryOptions(query, req.query);

  const results = await dl.read(query);
  sendJson(res, results);
};

module.exports = {
  dealer,
  site
};
