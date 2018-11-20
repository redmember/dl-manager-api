'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth');
const member = require('../controllers/member');
const site = require('../controllers/site');
const dlevent = require('../controllers/event');

router.get('/', (req, res) => { res.send('ok'); });

router.get('/v1/dl/dealers/:dealer_id/members', auth.test, member.read);
router.get('/v1/dl/dealers/:dealer_id/members/:member_id', auth.test, member.read);
router.post('/v1/dl/dealers/:dealer_id/members', auth.test, member.create);
router.delete('/v1/dl/dealers/:dealer_id/members', auth.test, member.del);

router.get('/v1/dl/dealers/:dealer_id/sites', auth.test, site.read);
router.put('/v1/dl/dealers/:dealer_id/sites/:site_id', auth.test, site.update);

router.get('/v1/dl/dealers/:dealer_id/events', auth.test, dlevent.dealer);
router.get('/v1/dl/dealers/:dealer_id/sites/:site_id/events', auth.test, dlevent.site);

module.exports = router;
