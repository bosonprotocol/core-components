"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
let config;
function getConfig() {
    if (!config) {
        config = { PORT: 0, CHAIN_ID: 0 };
    }
    return config;
}
exports.getConfig = getConfig;
