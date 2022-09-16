"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisServer = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("./logger");
const express_jwt_1 = require("express-jwt");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const logger = (0, logger_1.createLogger)(require('../package').name);
class RedisServer {
    constructor({ port, host, secret }) {
        this.port = port || 8088;
        this.host = host || '127.0.0.1';
        this.secret = secret;
        this.redis = new ioredis_1.default();
        this.express = this.createExpress();
    }
    createExpress() {
        const server = (0, express_1.default)();
        server.use((0, cors_1.default)());
        server.use((0, express_jwt_1.expressjwt)({
            secret: this.secret,
            algorithms: ['HS256']
        }));
        server.use(body_parser_1.default.json());
        server.post('/', (req, res) => {
            (async () => {
                const { method, params } = req.body;
                try {
                    res.json({
                        jsonrpc: '2.0',
                        result: await this.runCommand(method, params)
                    });
                }
                catch (e) {
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
    async runCommand(command, args) {
        logger.info('run-command: ' + command + ' ' + args.join(' '));
        const result = await this.redis[command](...args);
        logger.info('result: ' + result);
        return result;
    }
    async bind() {
        return await new Promise((resolve, reject) => {
            this.express.listen(this.port, this.host, () => {
                logger.info('bind(' + this.host + ':' + this.port + ') success');
            });
        });
    }
}
exports.RedisServer = RedisServer;
//# sourceMappingURL=server.js.map