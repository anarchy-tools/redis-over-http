"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function generate(secret) {
    return (0, jsonwebtoken_1.sign)({
        auth: true
    }, secret);
}
exports.generate = generate;
//# sourceMappingURL=generate.js.map