import { Router } from "express";
import { body } from "express-validator";
import * as metaTxController from "../controllers/meta-tx";

export const metaTxRouter = Router();

/**
 * @api `POST /api/v1/meta-tx/native`
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
metaTxRouter.post(
  "/",
  body("to").isString(),
  body("apiId").isString(),
  body("from").isString(),
  body("params").isArray(),
  metaTxController.postMetaTx
);
