import ioredis from "ioredis";
import express from "express";
declare type ExpressServer = ReturnType<typeof express>;
declare type Redis = ioredis;
export declare class RedisServer {
    port: number;
    host: string;
    secret: string;
    express: ExpressServer;
    redis: Redis;
    constructor({ port, host, secret }: {
        port: number;
        host: string;
        secret: string;
    });
    createExpress(): ExpressServer;
    runCommand(command: string, args: Array<string | number>): Promise<any>;
    bind(): Promise<unknown>;
}
export {};
