import express, { ErrorRequestHandler } from "express";
import { Server } from "http";
import { getConfig } from "./config";
import { ApiError } from "./errors/ApiError";
import { handleError } from "./middlewares/error";
import rootRouter from "./routes/root";
import { logger } from "./utils/logger";

export function startApp(): Server {
  const config = getConfig();

  const app = express();

  app.use(express.json());

  app.use("/api/v1", rootRouter);

  app.use((req, res, next) => {
    const error = new ApiError(404, "Route not found");
    next(error);
  });

  app.use(((error, req, res, next) => {
    next(handleError(error, res));
  }) as ErrorRequestHandler);

  return app.listen(config.PORT, () => {
    logger.info(`Meta-tx-gateway started on port ${config.PORT}.`);
    logger.info(`ChainId: ${JSON.stringify(config.CHAIN_ID)}`);
    logger.info(`RpcNode: ${JSON.stringify(config.RPC_NODE)}`);
  });
}
