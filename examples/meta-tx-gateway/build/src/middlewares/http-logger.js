"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("../utils/logger");
exports.httpLogger = (0, morgan_1.default)("date=:date[iso] method=:method status=:status url=:url response-time=:response-time ms", {
    skip: (req) => {
        return ["/", "/health"].includes(req.url || "");
    },
    stream: {
        write: (message) => {
            logger_1.httpWinstonLogger.http(message.substring(0, message.lastIndexOf("\n")));
        }
    }
});
