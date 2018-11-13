'use strict';

const member = require('../models/member');
const dealer = require('../models/dealer');
const permission = require('../helper/permission');
const qhelper = require('../helper/filter');
const createError = require('http-errors');

/* eslint camelcase: ["error", {ignoreDestructuring: true}] */
/* eslint-disable camelcase */

const sendJson = (res, json, code = 200) => {
  res.status(code).json(json);
};

/**
 * @api {post} /v1/dl/dealers/:dealer_id/members Create a member
 * @apiVersion 1.0.0
 * @apiGroup Member
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiParam {Number} member_id 멤버 아이디
 * @apiName Create
 * @apiPermission dealer
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 201 OK
 *  {
 *      "user_id": Number
 *  }
 * @apiUse CommonCreateResponse
 */
const create = async (req, res, next) => {
  const { dealer_id } = req.params;
  const { user_id } = req.user;
  const { member_id } = req.body;

  if (!dealer_id || !user_id) {
    return next(createError(400, 'Bad request'));
  }

  await permission.isDealerOwner(dealer_id, user_id);
  await dealer.member.findByDealerIdAndId(dealer_id, member_id);

  const data = { dealer_id, user_id: member_id };
  await member.create(data);
  sendJson(res, { code: 201, message: 'success' }, 201);
};

/**
 * @api {get} /v1/dl/dealers/:dealer_id/members Get all member
 * @apiVersion 1.0.0
 * @apiGroup Member
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiName List
 * @apiPermission dealer
 * @apiUse CommonReadResponse
 */
const read = async (req, res, next) => {
  const { dealer_id } = req.params;
  const { user_id } = req.user;

  await member.findByDealerIdAndId(dealer_id, user_id);

  const query = {};
  query.filter = [{ 'dealer_member.dealer_id': dealer_id }];
  query.fields = [
    'dealer_member.dealer_id',
    'dealer_member.user_id',
    'IF(ISNULL(dealer_dl_member.user_id), 0, 1) AS is_dl_member',
    'user.email',
    'user.firstname',
    'user.lastname',
    'user.provider_picture'
  ];
  query.join = [
    'INNER JOIN user ON dealer_member.user_id = user.user_id',
    'LEFT JOIN dealer_dl_member ON dealer_member.user_id = dealer_dl_member.user_id'
  ];
  qhelper.getQueryOptions(query, req.query);

  const results = await dealer.member.read(query);
  sendJson(res, results);
};

/**
 * @api {delete} /v1/dl/dealers/:dealer_id/members/:member_id Delete a member
 * @apiVersion 1.0.0
 * @apiGroup Member
 * @apiName Delete
 * @apiParam {Number} dealer_id 딜러 아이디
 * @apiParam {Number} member_id 멤버 아이디
 * @apiPermission dealer
 * @apiUse CommonUpdateResponse
 */
const del = async (req, res, next) => {
  const { dealer_id, member_id } = req.params;
  const { user_id } = req.user;

  const dealerInfo = await permission.isDealerOwner(dealer_id, user_id);
  await member.findByDealerIdAndId(dealer_id, member_id);

  if (dealerInfo.user_id === member_id) {
    return next(createError(400, 'The owner can not be deleted'));
  }

  await member.del([{ dealer_id: dealer_id }, { user_id: member_id }]);
  sendJson(res, { code: 200, message: 'success' });
};

module.exports = {
  create,
  read,
  del
};
