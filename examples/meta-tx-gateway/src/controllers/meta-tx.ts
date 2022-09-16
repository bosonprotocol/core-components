import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../errors/ApiError";
import { validationErrorFormatter } from "../utils/error";
import * as metaTxService from "../services/meta-tx";

export async function postMetaTx(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    metaTxService.PostMetaTxBody
  >,
  res: Response,
  next: NextFunction
) {
  try {
    // request body field types validation
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new ApiError(
        400,
        `Invalid body - ${validationErrors
          .formatWith(validationErrorFormatter)
          .array()}`
      );
    }

    const response = await metaTxService.postMetaTx({
      ...req.body
    });
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function getResubmitted(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await metaTxService.getResubmitted(
      req.query.transactionHash as string
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}
