/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IBosonOfferHandler230,
  IBosonOfferHandler230Interface,
} from "../IBosonOfferHandler230";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "offerId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "sellerId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sellerId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sellerDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyerCancelPenalty",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantityAvailable",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "exchangeToken",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadataUri",
            type: "string",
          },
          {
            internalType: "string",
            name: "metadataHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "voided",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "collectionIndex",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct BosonTypes.Offer",
        name: "offer",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "validFrom",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "validUntil",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voucherRedeemableFrom",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voucherRedeemableUntil",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct BosonTypes.OfferDates",
        name: "offerDates",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "disputePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voucherValid",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "resolutionPeriod",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct BosonTypes.OfferDurations",
        name: "offerDurations",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "disputeResolverId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "escalationResponsePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "buyerEscalationDeposit",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct BosonTypes.DisputeResolutionTerms",
        name: "disputeResolutionTerms",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "protocolFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "agentFee",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct BosonTypes.OfferFees",
        name: "offerFees",
        type: "tuple",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "agentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "executedBy",
        type: "address",
      },
    ],
    name: "OfferCreated",
    type: "event",
  },
];

export class IBosonOfferHandler230__factory {
  static readonly abi = _abi;
  static createInterface(): IBosonOfferHandler230Interface {
    return new utils.Interface(_abi) as IBosonOfferHandler230Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBosonOfferHandler230 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IBosonOfferHandler230;
  }
}
