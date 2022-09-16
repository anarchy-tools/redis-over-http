import ioredis from "ioredis";
import { createLogger } from "./logger";
import { expressjwt } from "express-jwt";
import express from "express";
import bodyParser from "body-parser";
import { EventEmitter } from "events";
import cors from 'cors';

const logger = createLogger(require('../package').name);

type ExpressServer = ReturnType<typeof express>;
type Redis = ioredis;

export class RedisServer {
  public port: number;
  public host: string;
  public secret: string;
  public express: ExpressServer;
  public redis: Redis;
  constructor({ port, host, secret }: {
    port: number;
    host: string;
    secret: string;
  }) {
    this.port = port || 8088;
    this.host = host || '127.0.0.1';
    this.secret = secret;
    this.redis = new ioredis();
    this.express = this.createExpress();
  }
  createExpress(): ExpressServer {
    const server = express();
    server.use(cors());
    server.use(expressjwt({
      secret: this.secret,
      algorithms: ['HS256']
    }));
    server.use(bodyParser.json());
    server.post('/', (req, res) => {
      (async () => {
        const { method, params } = req.body;
	try {
          res.json({
            jsonrpc: '2.0',
	    result: await this.runCommand(method, params)
	  });
	} catch (e) {
          res.json({
            jsonrpc: '2.0',
	    error: e.message,
	    code: -1
	  });
	  throw e;
	}
      })().catch(logger.error.bind(logger));
    });
    return server;
  }
  async runCommand(command: string, args: Array<string | number>) {
    logger.info('run-command: ' + command + ' ' + args.join(' '));
    const result = await this.redis[command](...args);
    logger.info('result: ' + result);
    return result;
  }
  async bind() {
    return await new Promise((resolve, reject) => {
      this.express.listen(this.port, this.host, () => {
        logger.info('bind(' + this.host + ':' + this.port + ') success');
      })
    });
  }
}
