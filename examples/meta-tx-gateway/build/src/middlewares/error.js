"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const ApiError_1 = require("../errors/ApiError");
const logger_1 = require("../utils/logger");
function handleError(error, res) {
    if (error instanceof ApiError_1.ApiError) {
        logger_1.logger.debug(`ApiError - code: ${error.statusCode}, stack: ${error.stack}`);
        res.status(error.statusCode).send({
            message: error.message
        });
    }
    else {
        logger_1.logger.error(`${error}, stack: ${error.stack}`);
        res.status(500).send({
            message: `Internal server error: ${error.message}`
        });
    }
}
exports.handleError = handleError;
