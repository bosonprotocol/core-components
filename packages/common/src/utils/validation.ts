import { array, object, string } from "yup";
import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";

export const createOfferArgsSchema = object({
  price: string()
    .required()
    .test("is-valid-price", (value) => isPositiveBigNumber(value)),
  deposit: string()
    .required()
    .test("is-valid-deposit", (value) => isPositiveBigNumber(value)),
  penalty: string()
    .required()
    .test("is-valid-penalty", (value) => isPositiveBigNumber(value)),
  quantity: string()
    .required()
    .test("is-valid-quantity", (value) => isPositiveBigNumber(value)),
  validFromDateInMS: string()
    .required()
    .test("is-valid-from-date", (value, ctx) => {
      return (
        isPositiveBigNumber(value) &&
        BigNumber.from(value).gt(Date.now()) &&
        BigNumber.from(ctx.parent.validUntilDateInMS).gt(BigNumber.from(value))
      );
    }),
  validUntilDateInMS: string()
    .required()
    .test("is-valid-until-date", (value, ctx) => {
      return (
        isPositiveBigNumber(value) &&
        BigNumber.from(value).gt(Date.now()) &&
        BigNumber.from(ctx.parent.validFromDateInMS).lt(BigNumber.from(value))
      );
    }),
  redeemableDateInMS: string()
    .required()
    .test(
      "is-valid-redeemable-date",
      (value) =>
        isPositiveBigNumber(value) && BigNumber.from(value).gt(Date.now())
    ),
  fulfillmentPeriodDurationInMS: string()
    .required()
    .test("is-valid-fulfillment-period", (value) => isPositiveBigNumber(value)),
  voucherValidDurationInMS: string()
    .required()
    .test("is-valid-duration", (value) => isPositiveBigNumber(value)),
  seller: string()
    .required()
    .test("is-valid-seller", (value) => isAddress(value || "")),
  exchangeToken: string()
    .required()
    .test("is-valid-exchange-token", (value) => isAddress(value || "")),
  metadataUri: string().required().url(),
  metadataHash: string().required()
});

const commonMetadataSchema = {
  name: string().required(),
  description: string().required(),
  externalUrl: string().required(),
  schemaUrl: string().required(),
  type: string().required()
};

export const baseMetadataSchema = object({
  ...commonMetadataSchema
});

export const productV1MetadataSchema = object({
  ...commonMetadataSchema,
  images: array(string()),
  tags: array(string()),
  brandName: string()
});

function isPositiveBigNumber(value: unknown) {
  try {
    const bigNumber = BigNumber.from(value);
    return !bigNumber.isNegative();
  } catch (error) {
    return false;
  }
}
