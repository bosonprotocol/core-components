import * as yup from "yup";
import { ITokenInfo } from "./../utils/tokenInfoManager";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { PriceType, utils } from "@bosonprotocol/common";
import Mustache from "mustache";
import { formatUnits } from "@ethersproject/units";

import { CreateOfferArgs } from "./types";
import {
  OfferFieldsFragment,
  MetadataType,
  ProductV1MetadataEntity
} from "../subgraph";
import { AddressZero } from "@ethersproject/constants";

export type AdditionalOfferMetadata = {
  sellerContactMethod: string;
  disputeResolverContactMethod: string;
  escalationDeposit: BigNumberish;
  escalationResponsePeriodInSec: BigNumberish;
  sellerTradingName: string;
  returnPeriodInDays: number;
};

export type TemplateRenderingData = CreateOfferArgs &
  AdditionalOfferMetadata & {
    priceValue: string; // Convert in decimals value
    sellerDepositValue: string; // Convert in decimals value
    buyerCancelPenaltyValue: string; // Convert in decimals value
    escalationDepositValue: string; // Convert in decimals value
    exchangeTokenSymbol: string;
    hasExpirationDate: boolean;
    toISOString: () => void;
    msecToDay: () => void;
    secToDay: () => void;
  };

export class InvalidOfferDataError extends Error {
  constructor(public missingProperties: string[]) {
    super(
      `InvalidOfferData - missing properties: [${missingProperties.join(",")}]`
    );
  }
}

export class InvalidOfferMetadataError extends Error {
  constructor(public missingProperties: string[]) {
    super(
      `InvalidOfferMetadata - missing properties: [${missingProperties.join(
        ","
      )}]`
    );
  }
}

export const baseOfferDataSchema: yup.ObjectSchema<BaseOfferData> = yup
  .object({
    price: yup.mixed<BigNumberish>().required(),
    sellerDeposit: yup.mixed<BigNumberish>().required(),
    agentId: yup.mixed<BigNumberish>().required(),
    buyerCancelPenalty: yup.mixed<BigNumberish>().required(),
    quantityAvailable: yup.mixed<BigNumberish>().required(),
    validFromDateInMS: yup.mixed<BigNumberish>().required(),
    validUntilDateInMS: yup.mixed<BigNumberish>().required(),
    voucherRedeemableFromDateInMS: yup.mixed<BigNumberish>().required(),
    voucherRedeemableUntilDateInMS: yup.mixed<BigNumberish>().required(),
    disputePeriodDurationInMS: yup.mixed<BigNumberish>().required(),
    resolutionPeriodDurationInMS: yup.mixed<BigNumberish>().required(),
    exchangeToken: yup.string().required(),
    disputeResolverId: yup.mixed<BigNumberish>().required(),
    metadataUri: yup.string().required(),
    metadataHash: yup.string().required()
  })
  .required();

export type BaseOfferData = {
  price: BigNumberish;
  sellerDeposit: BigNumberish;
  agentId: BigNumberish;
  buyerCancelPenalty: BigNumberish;
  quantityAvailable: BigNumberish;
  validFromDateInMS: BigNumberish;
  validUntilDateInMS: BigNumberish;
  voucherRedeemableFromDateInMS: BigNumberish;
  voucherRedeemableUntilDateInMS: BigNumberish;
  disputePeriodDurationInMS: BigNumberish;
  resolutionPeriodDurationInMS: BigNumberish;
  exchangeToken: string;
  disputeResolverId: BigNumberish;
  metadataUri: string;
  metadataHash: string;
};

export const baseOfferMetadataSchema: yup.ObjectSchema<AdditionalOfferMetadata> =
  yup
    .object({
      sellerContactMethod: yup.string().required(),
      disputeResolverContactMethod: yup.string().required(),
      escalationDeposit: yup.mixed<BigNumberish>().required(),
      escalationResponsePeriodInSec: yup.mixed<BigNumberish>().required(),
      sellerTradingName: yup.string().required(),
      returnPeriodInDays: yup.number().required()
    })
    .required();

function checkOfferDataIsValid(
  offerData: unknown,
  throwIfInvalid = false
): boolean {
  if (offerData === undefined || offerData === null) {
    throw new Error("InvalidOfferData - undefined");
  }
  if (typeof offerData !== "object") {
    throw new Error("InvalidOfferData - expecting an object");
  }
  try {
    baseOfferDataSchema.validateSync(offerData, { abortEarly: false });
  } catch (e) {
    const missingProperties = [];
    const getMissingProp = (error) => {
      return error.match(/(.*) is a required field/)[1] || error;
    };
    if (throwIfInvalid) {
      if (e.errors) {
        e.errors.forEach((error: string) => {
          missingProperties.push(getMissingProp(error));
        });
      } else {
        missingProperties.push(getMissingProp(e));
      }
      throw new InvalidOfferDataError(missingProperties);
    }
    return false;
  }
  return true;
}

function checkOfferMetadataIsValid(
  offerMetadata: unknown,
  throwIfInvalid = false
): boolean {
  if (offerMetadata === undefined || offerMetadata === null) {
    throw new Error("InvalidOfferMetadata - undefined");
  }
  if (typeof offerMetadata !== "object") {
    throw new Error("InvalidOfferMetadata - expecting an object");
  }
  try {
    baseOfferMetadataSchema.validateSync(offerMetadata, { abortEarly: false });
  } catch (e) {
    const missingProperties = [];
    const getMissingProp = (error) => {
      return error.match(/(.*) is a required field/)[1] || error;
    };
    if (throwIfInvalid) {
      if (e.errors) {
        e.errors.forEach((error: string) => {
          missingProperties.push(getMissingProp(error));
        });
      } else {
        missingProperties.push(getMissingProp(e));
      }
      throw new InvalidOfferMetadataError(missingProperties);
    }
    return false;
  }
  return true;
}

function convertExistingOfferData(offerDataSubGraph: OfferFieldsFragment): {
  offerData: CreateOfferArgs;
  offerMetadata: AdditionalOfferMetadata;
  tokenInfo: ITokenInfo;
} {
  return {
    offerData: {
      ...offerDataSubGraph,
      validFromDateInMS: offerDataSubGraph.validFromDate,
      validUntilDateInMS: offerDataSubGraph.validUntilDate,
      voucherRedeemableFromDateInMS:
        offerDataSubGraph.voucherRedeemableFromDate,
      voucherRedeemableUntilDateInMS:
        offerDataSubGraph.voucherRedeemableUntilDate,
      disputePeriodDurationInMS: offerDataSubGraph.disputePeriodDuration,
      resolutionPeriodDurationInMS: offerDataSubGraph.resolutionPeriodDuration,
      exchangeToken: offerDataSubGraph.exchangeToken.address,
      feeLimit: offerDataSubGraph.price, // feeLimit is never stored on-chain. By default, set it to offer price
      priceType: PriceType.Static,
      royaltyInfo: [
        {
          recipients: [AddressZero], // AddressZero means Seller's treasury account
          bps: ["0"] // Values should be greater or equal than Seller's minimum royalty amount
        }
      ]
    },
    offerMetadata: {
      sellerContactMethod: (
        offerDataSubGraph.metadata as ProductV1MetadataEntity
      )?.exchangePolicy.sellerContactMethod,
      disputeResolverContactMethod: (
        offerDataSubGraph.metadata as ProductV1MetadataEntity
      )?.exchangePolicy.disputeResolverContactMethod,
      escalationDeposit:
        offerDataSubGraph.disputeResolutionTerms.buyerEscalationDeposit,
      escalationResponsePeriodInSec:
        offerDataSubGraph.disputeResolutionTerms.escalationResponsePeriod,
      sellerTradingName: (offerDataSubGraph.metadata as ProductV1MetadataEntity)
        ?.productV1Seller?.name,
      returnPeriodInDays: (
        offerDataSubGraph.metadata as ProductV1MetadataEntity
      )?.shipping.returnPeriodInDays
    },
    tokenInfo: {
      ...offerDataSubGraph.exchangeToken,
      decimals: parseInt(offerDataSubGraph.exchangeToken.decimals)
    }
  };
}

const MAX_AND_MIN_DATE_TIMESTAMP = 8.64e15; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
export async function prepareRenderingData(
  offerData: CreateOfferArgs,
  offerMetadata: AdditionalOfferMetadata,
  tokenInfo: ITokenInfo
): Promise<TemplateRenderingData> {
  return {
    ...offerData,
    ...offerMetadata,
    priceValue: formatUnits(offerData.price, tokenInfo.decimals),
    exchangeTokenSymbol: tokenInfo.symbol,
    sellerDepositValue: formatUnits(
      offerData.sellerDeposit,
      tokenInfo.decimals
    ),
    buyerCancelPenaltyValue: formatUnits(
      offerData.buyerCancelPenalty,
      tokenInfo.decimals
    ),
    escalationDepositValue: formatUnits(
      offerMetadata.escalationDeposit,
      tokenInfo.decimals
    ),
    hasExpirationDate:
      !!offerData.validUntilDateInMS &&
      Number(offerData.validUntilDateInMS.toString()) <
        MAX_AND_MIN_DATE_TIMESTAMP,
    toISOString: function () {
      return function (num, render) {
        try {
          return new Date(parseInt(render(num))).toISOString();
        } catch {
          return `[[${num} - invalid Date]]`;
        }
      };
    },
    msecToDay: function () {
      return function (num, render) {
        try {
          return BigNumber.from(render(num))
            .div(utils.timestamp.MSEC_PER_DAY)
            .toString();
        } catch {
          return `[[${num} - invalid BigNumber]]`;
        }
      };
    },
    secToDay: function () {
      return function (num, render) {
        try {
          return BigNumber.from(render(num))
            .div(utils.timestamp.SEC_PER_DAY)
            .toString();
        } catch {
          return `[[${num} - invalid BigNumber]]`;
        }
      };
    }
  };
}

// inject a template + all offer details
export async function renderContractualAgreement(
  template: string,
  offerData: CreateOfferArgs,
  offerMetadata: AdditionalOfferMetadata,
  tokenInfo: ITokenInfo
): Promise<string> {
  // Check the passed offerData is matching the required type
  checkOfferDataIsValid(offerData, true);
  checkOfferMetadataIsValid(offerMetadata, true);
  const preparedData = await prepareRenderingData(
    offerData,
    offerMetadata,
    tokenInfo
  );
  return Mustache.render(template, preparedData);
}

export async function renderContractualAgreementForOffer(
  existingOfferData: OfferFieldsFragment
): Promise<string> {
  if (!existingOfferData) {
    throw new Error(`offerData is undefined`);
  }
  if (!existingOfferData.metadata) {
    throw new Error(`Offer Metadata is undefined`);
  }
  if (existingOfferData.metadata.type !== MetadataType.PRODUCT_V1) {
    throw new Error(
      `Invalid Offer Metadata: Type is not supported: '${existingOfferData.metadata.type}'`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(existingOfferData.metadata as any).exchangePolicy) {
    throw new Error(`Invalid Offer Metadata: exchangePolicy is not defined`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(existingOfferData.metadata as any).exchangePolicy.template) {
    throw new Error(
      `Invalid Offer Metadata: exchangePolicy.template is not defined`
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const template = (existingOfferData.metadata as any).exchangePolicy.template;
  const convertedOfferArgs = convertExistingOfferData(existingOfferData);
  return renderContractualAgreement(
    template,
    convertedOfferArgs.offerData,
    convertedOfferArgs.offerMetadata,
    convertedOfferArgs.tokenInfo
  );
}
