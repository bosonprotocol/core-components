import { Router } from "express";

import * as healthController from "../controllers/health";

export const healthRouter = Router();

/**
 * @api `GET /health`
 * @description Returns health status.
 */
healthRouter.get("/health", healthController.getHealthStatus);

/**
 * @api `GET /ready`
 * @description Returns ready status.
 */
healthRouter.get("/ready", healthController.getReadyStatus);

export default healthRouter;
