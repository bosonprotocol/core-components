import { Router } from "express";
import { body } from "express-validator";
import * as metaTxController from "../controllers/meta-tx";

export const metaTxRouterV1 = Router();
export const metaTxRouterV2 = Router();

/**
 * @api `POST /api/v2/meta-tx/native`
 * @description Relay a meta-transaction.
 * ```ts
 * type PostMetaTxBody = {
 *   to: string;
 *   apiId: string;
 *   params: any[];
 *   from: string;
 * }
 *
 * type PostMetaTxResponse = {
 *   to: string;
 *   from: string;
 *   txHash: string;
 * }
 * ```
 */
metaTxRouterV2.post(
  "/native",
  body("to").isString(),
  body("apiId").isString(),
  body("from").isString(),
  body("params").isArray(),
  metaTxController.postMetaTx
);

/**
 * @api `GET /api/v1/meta-tx/resubmitted`
 * @description Get resubmitted transaction if any.
 * ```ts
 *
 * type PostMetaTxResponse = {
 * TBD...
 * }
 * ```
 */
metaTxRouterV1.get("/resubmitted", metaTxController.getResubmitted);
