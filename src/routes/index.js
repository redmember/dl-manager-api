'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');
const dl = require('../receiver/dl');
const member = require('../controllers/member');
const site = require('../controllers/site');
const dlevent = require('../controllers/event');

router.get('/', (req, res) => { res.send('ok'); });
router.post('/v1/dl/result', auth.dl, dl.create);
router.put('/v1/dl/result', auth.dl, dl.create);

router.post('/v1/dl/multipart_result', auth.dl, dl.createMultipart);
router.put('/v1/dl/multipart_result', auth.dl, dl.createMultipart);

router.get('/v1/dl/dealers/:dealer_id/members', auth.user, member.read);
router.get('/v1/dl/dealers/:dealer_id/members/:member_id', auth.user, member.read);
router.post('/v1/dl/dealers/:dealer_id/members', auth.user, member.create);
router.delete('/v1/dl/dealers/:dealer_id/members', auth.user, member.del);

router.get('/v1/dl/dealers/:dealer_id/sites', auth.user, site.read);
router.put('/v1/dl/dealers/:dealer_id/sites/:site_id', auth.user, site.update);

router.get('/v1/dl/dealers/:dealer_id/events', auth.user, dlevent.dealer);
router.get('/v1/dl/dealers/:dealer_id/sites/:site_id/events', auth.user, dlevent.site);

module.exports = router;
