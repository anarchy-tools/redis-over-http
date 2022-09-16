'use strict';

const { generate } = require('../lib/generate');

console.log(generate(process.env.REDIS_OVER_HTTP_SECRET || 'redis'));
