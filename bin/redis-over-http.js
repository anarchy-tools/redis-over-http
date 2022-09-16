'use strict';

const { RedisServer } = require('../lib');


(async () => {
  const server = new RedisServer({
    host: process.env.REDIS_OVER_HTTP_HOST || '127.0.0.1',
    port: process.env.REDIS_OVER_HTTP_PORT || 8088,
    secret: process.env.REDIS_OVER_HTTP_SECRET || 'redis'
  });
  server.bind();
})().catch(console.error);
