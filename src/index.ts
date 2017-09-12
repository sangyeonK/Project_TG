import './controller/codetable';
import './controller/friend';
import './controller/login';
import './controller/message';
import './controller/userinfo';

import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import logger from './common/logger';

import { RegisterRoutes } from './routes';

const server = express();

server.use(compression());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

RegisterRoutes(server);

server.use(function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.write(JSON.stringify({ error: err }));
  res.end();

  logger.error(err);
});

server.listen(3000, function () {
  logger.info('Express server listening on port %d in %s mode', 3000, server.get('env'));
});
