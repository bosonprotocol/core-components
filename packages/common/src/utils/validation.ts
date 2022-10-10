import { object, string } from "yup";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";

export { validateMetadata } from "@bosonprotocol/metadata";

const positiveIntTestArgs: [string, string, typeof isPositiveInt] = [
  "is-positive-int",
  "${path} has to be a positive integer",
  isPositiveInt
];
const futureDateTestArgs: [string, string, typeof isFutureDate] = [
  "is-future-date",
  "${path} has to be a date in the future",
  isFutureDate
];
const addressTestArgs: [string, string, typeof isAddress] = [
  "is-address",
  "${path} has to be a valid address",
  (value: string) => isAddress(value || "")
];

export const createOfferArgsSchema = object({
  price: string()
    .required()
    .test(...positiveIntTestArgs),
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
    .test(...positiveIntTestArgs),
  validFromDateInMS: string()
    .required()
    .test(...positiveIntTestArgs)
    .test(...futureDateTestArgs)
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
    .test(...futureDateTestArgs)
    .when("voucherRedeemableUntilDateInMS", {
      is: isNotZero,
      then: string().test(
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
      then: string()
        .test(
          "not-zero",
          "Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMShas must be non zero",
          isNotZero
        )
        .test(...futureDateTestArgs)
        .test(
          "is-after-redeemable-from-date",
          "${path} has to be after voucherRedeemableFromDateInMS",
          (value, ctx) => {
            return BigNumber.from(ctx.parent.voucherRedeemableFromDateInMS).lt(
              BigNumber.from(value)
            );
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
      otherwise: string().test(
        "is-zero",
        "Exactly one of voucherRedeemableUntilDateInMS and voucherValidDurationInMShas must be non zero",
        isZero
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
  operator: string()
    .required()
    .test(...addressTestArgs),
  admin: string()
    .required()
    .test(...addressTestArgs),
  clerk: string()
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
