import { object, string, number, lazy } from "yup";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import { OfferCreator, PriceType } from "../types/index";

export { validateMetadata } from "@bosonprotocol/metadata";

const positiveIntTestArgs = [
  "is-positive-int",
  "${path} has to be a positive integer",
  (value: unknown) => isPositiveInt(value || "")
] as const;
const futureDateTestArgs = [
  "is-future-date",
  "${path} has to be a date in the future",
  (value: string | undefined) => isFutureDate(value || "")
] as const;
const addressTestArgs = [
  "is-address",
  "${path} has to be a valid address",
  (value: string | undefined) => isAddress(value || "")
] as const;

export const createOfferArgsSchema = object({
  price: string()
    .required()
    .test(...positiveIntTestArgs),
  priceType: number()
    .optional()
    .oneOf(
      Object.values(PriceType).filter((v) => typeof v === "number") as number[]
    ),
  creator: number()
    .optional()
    .oneOf(
      Object.values(OfferCreator).filter(
        (v) => typeof v === "number"
      ) as number[]
    ),
  mutualizerAddress: lazy((val) => {
    if (val === null || val === undefined) {
      return string().nullable().notRequired();
    }
    return string()
      .optional()
      .test(...addressTestArgs);
  }),
  sellerDeposit: string()
    .required()
    .test(...positiveIntTestArgs),
  buyerCancelPenalty: string()
    .required()
    .test(...positiveIntTestArgs)
    .test(
      "is-less-than-or-equal-price",
      "${path} has to be less than or equal price",
      (value, ctx) =>
        BigNumber.from(value).lte(BigNumber.from(ctx.parent.price))
    ),
  quantityAvailable: string()
    .required()
    .test(...positiveIntTestArgs)
    .test(
      "is-valid-buyer-quantity",
      "Quantity must be 1 for buyer initiated offers",
      (value, ctx) => {
        if (ctx.parent.creator === OfferCreator.Buyer) {
          return BigNumber.from(value).eq(1);
        }
        return true;
      }
    ),
  validFromDateInMS: string()
    .required()
    .test(...positiveIntTestArgs)
    .test(
      "is-before-valid-until-date",
      "${path} has to be before validUntilDate",
      (value, ctx) => {
        return BigNumber.from(ctx.parent.validUntilDateInMS).gt(
          BigNumber.from(value)
        );
      }
    ),
  validUntilDateInMS: string()
    .required()
    .test(...positiveIntTestArgs)
    .test(...futureDateTestArgs)
    .test(
      "is-after-valid-from-date",
      "${path} has to be after validFromDate",
      (value, ctx) => {
        return BigNumber.from(ctx.parent.validFromDateInMS).lt(
          BigNumber.from(value)
        );
      }
    ),
  voucherRedeemableFromDateInMS: string()
    .required()
    .test(...positiveIntTestArgs)
    .when("voucherRedeemableUntilDateInMS", {
      is: isNotZero,
      then: (schema) =>
        schema.test(
          "is-before-redeemable-until-date",
          "${path} has to be before voucherRedeemableUntilDateInMS",
          (value, ctx) => {
            return BigNumber.from(ctx.parent.voucherRedeemableUntilDateInMS).gt(
              BigNumber.from(value)
            );
          }
        )
    }),
  voucherRedeemableUntilDateInMS: string()
    .required()
    .test(...positiveIntTestArgs)
    .when("voucherValidDurationInMS", {
      is: isZero,
      then: (schema) =>
        schema
          .test(
            "not-zero",
            "Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMS must be non zero",
            (value: string | undefined) => isNotZero(value || "")
          )
          .test(...futureDateTestArgs)
          .test(
            "is-after-redeemable-from-date",
            "${path} has to be after voucherRedeemableFromDateInMS",
            (value, ctx) => {
              return BigNumber.from(
                ctx.parent.voucherRedeemableFromDateInMS
              ).lt(BigNumber.from(value));
            }
          )
          .test(
            "is-after-valid-until-date",
            "${path} has to be after or equal validUntilDateInMS",
            (value, ctx) => {
              return BigNumber.from(ctx.parent.validUntilDateInMS).lte(
                BigNumber.from(value)
              );
            }
          ),
      otherwise: (schema) =>
        schema.test(
          "is-zero",
          "Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMS must be non zero",
          (value: string | undefined) => isZero(value || "")
        )
    }),
  voucherValidDurationInMS: string()
    .optional()
    .nullable()
    .test(...positiveIntTestArgs),
  disputePeriodDurationInMS: string()
    .required()
    .test(...positiveIntTestArgs),
  resolutionPeriodDurationInMS: string()
    .required()
    .test(...positiveIntTestArgs),
  exchangeToken: string()
    .required()
    .test(...addressTestArgs),
  metadataUri: string()
    .required()
    .test(
      "is-valid-metadata-uri",
      "${path} has to be a valid uri",
      isMetadataUri
    ),
  metadataHash: string().required()
  // TODO: add agentId
});

export const createSellerArgsSchema = object({
  assistant: string()
    .required()
    .test(...addressTestArgs),
  admin: string()
    .required()
    .test(...addressTestArgs),
  treasury: string()
    .required()
    .test(...addressTestArgs),
  contractUri: string()
    .required()
    .test(
      "is-valid-metadata-uri",
      "${path} has to be a valid uri",
      isMetadataUri
    )
  // TODO: add authTokenId and authTokenType
});

function isPositiveInt(value: unknown) {
  try {
    const bigNumber = BigNumber.from(value || 0);
    return !bigNumber.isNegative();
  } catch (error) {
    return false;
  }
}

function isFutureDate(value: string) {
  return BigNumber.from(value).gt(Date.now());
}

function isZero(value: BigNumberish) {
  return BigNumber.from(value).isZero();
}

function isNotZero(value: BigNumberish) {
  return !isZero(value);
}

function isMetadataUri(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  if (/^(ipfs|http|https):\/\/[^ "]+$/.test(value)) {
    return true;
  }

  // IPFS CID v0
  if (value.startsWith("Qm") && value.length === 46) {
    return true;
  }

  // TODO: IPFS CID v1

  return false;
}
