import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { Server } from "http";
import { getConfig } from "./config";
import { ApiError } from "./errors/ApiError";
import { handleError } from "./middlewares/error";
import rootRouter from "./routes/root";
import { logger } from "./utils/logger";

export function startApp(): Server {
  const config = getConfig();

  const app = express();
  // options for cors middleware
  const options: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Access-Control-Allow-Origin",
      "x-api-key" // to simulate Biconomy API
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: true,
    preflightContinue: false
  };
  app.use(cors(options));

  app.use(express.json());

  app.use("/", rootRouter);

  app.use((req, res, next) => {
    const error = new ApiError(404, "Route not found");
    next(error);
  });

  app.use(((error, req, res, next) => {
    next(handleError(error, res));
  }) as ErrorRequestHandler);

  return app.listen(config.PORT, async () => {
    logger.info(`Meta-tx-gateway started on port ${config.PORT}.`);
    logger.info(`EnvName: ${config.ENV_NAME}`);
    logger.info(`ChainId: ${config.CHAIN_ID}`);
    logger.info(`RpcNode: ${config.RPC_NODE}`);
    logger.info(`Forwarder: ${config.FORWARDER}`);
    logger.info(`Seaport Address: ${config.SEAPORT_ADDRESS}`);
    logger.info(`OpenSea Fee Recipient: ${config.OPENSEA_FEE_RECIPIENT}`);
    logger.info(
      `OpenSea Fee Percentage: ${config.OPENSEA_FEE_PERCENTAGE / 100}%`
    );
  });
}
