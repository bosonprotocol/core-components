import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../errors/ApiError";
import { validationErrorFormatter } from "../utils/error";
import * as openseaService from "../services/opensea";

export async function postOrder(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    openseaService.PostOrderBody
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

    const response = await openseaService.postOrder(
      req.params["chain"] as string,
      req.params["protocol"] as string,
      req.params["sidePath"] as string,
      {
        ...req.body
      }
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function getOrder(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await openseaService.getOrders(
      req.params["chain"] as string,
      req.params["protocol"] as string,
      req.params["sidePath"] as string,
      req.query.asset_contract_address as string,
      req.query.token_ids as string
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function getNft(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await openseaService.getNft(
      req.params["chain"] as string,
      req.params["assetContractAddress"] as string,
      req.params["tokenId"] as string
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function getCollection(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await openseaService.getCollection(
      req.params["slug"] as string
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function postFulfillmentData(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    openseaService.PostFulfillmentDataBody
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

    const response = await openseaService.computeFulfillmentData(
      req.params["sidePath"] as string,
      {
        ...req.body
      }
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

export async function getPaymentToken(
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const response = await openseaService.getPaymentToken(
      req.params["chain"] as string,
      req.params["token"] as string
    );
    return res.send(response);
  } catch (error) {
    next(error);
  }
}
