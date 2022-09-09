"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const ApiError_1 = require("./errors/ApiError");
const error_1 = require("./middlewares/error");
const logger_1 = require("./utils/logger");
function startApp() {
    const config = (0, config_1.getConfig)();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // app.use("/api/v1", rootRouter);
    app.use((req, res, next) => {
        const error = new ApiError_1.ApiError(404, "Route not found");
        next(error);
    });
    app.use(((error, req, res, next) => {
        next((0, error_1.handleError)(error, res));
    }));
    return app.listen(config.PORT, () => {
        logger_1.logger.info(`Meta-tx-gateway started on port ${config.PORT}.`);
        logger_1.logger.info(`ChainId: ${JSON.stringify(config.CHAIN_ID)}`);
    });
}
exports.startApp = startApp;
