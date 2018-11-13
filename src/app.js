'use strict';

const http = require('http');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const routes = require('./routes/index');
const config = require('./common/config');
const logger = require('./common/logger');
const slack = require('./common/slack');
const resend = require('./common/resend');
const accessLogger = require('./common/access-logger');

app.use(accessLogger());
app.set('trust proxy', true);
app.disable('x-powered-by');
app.disable('etag');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use('/doc/', express.static(path.join(__dirname, '../doc/html')));
}

app.use('/', routes);
app.use(resend.notFoundHandle);
app.use(resend.errorHandle);

app.set('port', config.http.port);
const server = http.createServer(app);

server.listen(config.http.port, '0.0.0.0');

server.on('error', error => {
  slack.noti(config.name.api, (err, message) => {
    if (err) {
      logger.error(err);
    } else {
      logger.notice(message);
    }
  });
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      logger.error('port: ' + config.http.port + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      logger.error('port: ' + config.http.port + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  logger.notice('Listening on ' + bind);
  slack.noti(config.name.api, (err, message) => {
    if (err) {
      logger.error(err);
    } else {
      logger.notice(message);
    }
  });
});
