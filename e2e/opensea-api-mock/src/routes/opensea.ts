import { Router } from "express";
import { body, oneOf, param } from "express-validator";
import * as openseaController from "../controllers/opensea";

export const openseaV2 = Router();

openseaV2.post(
  "/orders/:chain/:protocol/:sidePath",
  body("signature").isString(),
  body("protocol_address").isString(),
  body("parameters.offer").isArray(),
  body("parameters.consideration").isArray(),
  openseaController.postOrder
);

openseaV2.get("/orders/:chain/:protocol/:sidePath", openseaController.getOrder);

openseaV2.get(
  "/chain/:chain/contract/:assetContractAddress/nfts/:tokenId",
  openseaController.getNft
);

openseaV2.get("/collections/:slug", openseaController.getCollection);

openseaV2.post(
  "/:sidePath/fulfillment_data",
  body("fulfiller.address").isString(),
  oneOf([
    [
      param("sidePath").equals("offers"),
      body("offer.hash").isString(),
      body("offer.chain").isString(),
      body("offer.protocol_address").isString()
    ],
    [
      param("sidePath").equals("listings"),
      body("listing.hash").isString(),
      body("listing.chain").isString(),
      body("listing.protocol_address").isString()
    ]
  ]),
  openseaController.postFulfillmentData
);

openseaV2.get(
  "/chain/:chain/payment_token/:token",
  openseaController.getPaymentToken
);
