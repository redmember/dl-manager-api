'use strict';

const request = require('request');
const os = require('os');
const moment = require('moment');
const config = require('./config');

const noti = (name, cb) => {
  if (process.env.NODE_ENV === 'development') {
    return cb(null, 'The slack notification not send in development');
  }

  const payload = {
    text: 'Alarm ' + name + ' Service Started',
    color: '#FF8000',
    ts: parseInt(Date.now() / 1000),
    fields: [
      {
        title: 'Project',
        value: 'CHeKT',
        short: true
      },
      {
        title: 'Environment',
        value: process.env.NODE_ENV,
        short: true
      },
      {
        title: 'Cpu Number',
        value: os.cpus().length,
        short: true
      },
      {
        title: 'Instance ID',
        value: process.env.pm_id || 'unknown',
        short: true
      },
      {
        title: 'Hostname',
        value: os.hostname(),
        short: true
      },
      {
        title: 'Start Time',
        value: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
        short: true
      }
    ]
  };

  const data = {
    url: config.notification.slack.webhookUrl,
    json: { attachments: [payload] }
  };

  request.post(data, (err, response) => {
    if (err) {
      cb(null, 'slack notification error');
    } else {
      cb(null, 'slack notification : ' + response.statusCode);
    }
  });
};

module.exports = {
  noti
};
