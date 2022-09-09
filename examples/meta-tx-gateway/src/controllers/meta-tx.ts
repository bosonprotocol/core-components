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

    const txHash = await metaTxService.postMetaTx({
      ...req.body
    });
    return res.send({ txHash, to: req.body.to, from: req.body.from });
  } catch (error) {
    next(error);
  }
}
