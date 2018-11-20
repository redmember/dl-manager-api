'use strict';

const dealer = require('../models/dealer');
const createError = require('http-errors');

const isDealerOwner = async (dealerId, userId) => {
  const dealerInfo = await dealer.find(dealerId);
  if (dealerInfo.user_id === userId) {
    throw createError(403, 'Permission denied');
  }
  return dealerInfo;
};

module.exports = {
  isDealerOwner
};
