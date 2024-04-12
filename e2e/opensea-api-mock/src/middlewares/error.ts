import { Response } from "express";
import { ApiError } from "../errors/ApiError";
import { logger } from "../utils/logger";

export function handleError(error: ApiError | Error, res: Response): void {
  if (error instanceof ApiError) {
    logger.debug(`ApiError - code: ${error.statusCode}, stack: ${error.stack}`);
    res.status(error.statusCode).send({
      message: error.message
    });
  } else {
    logger.error(`${error}, stack: ${error.stack}`);
    res.status(500).send({
      message: `Internal server error: ${error.message}`
    });
  }
}
