import * as yup from "yup";
import { ITokenInfo } from "./../utils/tokenInfoManager";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { offers, subgraph } from "..";
import { utils } from "@bosonprotocol/common";
import Mustache from "mustache";
import { formatUnits } from "@ethersproject/units";
import { productV1 } from "@bosonprotocol/metadata";

export type TemplateRenderingData = offers.CreateOfferArgs & {
  priceValue: string; // Convert in decimals value
  sellerDepositValue: string; // Convert in decimals value
  buyerCancelPenaltyValue: string; // Convert in decimals value
  agentFeeValue: string; // Convert in decimals value
  exchangeTokenSymbol: string;
  sellerContactMethod: string;
  disputeResolverContactMethod: string;
  toISOString: () => void;
  msecToDay: () => void;
};

export class InvalidOfferDataError extends Error {
  constructor(public missingProperties: string[]) {
    super(
      `InvalidOfferData - missing properties: [${missingProperties.join(",")}]`
    );
  }
}

export const baseOfferDataSchema: yup.SchemaOf<BaseOfferData> = yup.object({
  price: yup.mixed().required(),
  sellerDeposit: yup.mixed().required(),
  agentId: yup.mixed().required(),
  buyerCancelPenalty: yup.mixed().required(),
  quantityAvailable: yup.mixed().required(),
  validFromDateInMS: yup.mixed().required(),
  validUntilDateInMS: yup.mixed().required(),
  voucherRedeemableFromDateInMS: yup.mixed().required(),
  voucherRedeemableUntilDateInMS: yup.mixed().required(),
  fulfillmentPeriodDurationInMS: yup.mixed().required(),
  resolutionPeriodDurationInMS: yup.mixed().required(),
  exchangeToken: yup.string().required(),
  disputeResolverId: yup.mixed().required(),
  metadataUri: yup.string().required(),
  metadataHash: yup.string().required()
});

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
  fulfillmentPeriodDurationInMS: BigNumberish;
  resolutionPeriodDurationInMS: BigNumberish;
  exchangeToken: string;
  disputeResolverId: BigNumberish;
  metadataUri: string;
  metadataHash: string;
};

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

function convertExistingOfferData(
  offerDataSubGraph: subgraph.OfferFieldsFragment
): { offerData: offers.CreateOfferArgs; tokenInfo: ITokenInfo } {
  return {
    offerData: {
      ...offerDataSubGraph,
      validFromDateInMS: offerDataSubGraph.validFromDate,
      validUntilDateInMS: offerDataSubGraph.validUntilDate,
      voucherRedeemableFromDateInMS:
        offerDataSubGraph.voucherRedeemableFromDate,
      voucherRedeemableUntilDateInMS:
        offerDataSubGraph.voucherRedeemableUntilDate,
      fulfillmentPeriodDurationInMS:
        offerDataSubGraph.fulfillmentPeriodDuration,
      resolutionPeriodDurationInMS: offerDataSubGraph.resolutionPeriodDuration,
      exchangeToken: offerDataSubGraph.exchangeToken.address
    },
    tokenInfo: {
      ...offerDataSubGraph.exchangeToken,
      decimals: parseInt(offerDataSubGraph.exchangeToken.decimals)
    }
  };
}

export async function prepareRenderingData(
  offerData: offers.CreateOfferArgs,
  tokenInfo: ITokenInfo
): Promise<TemplateRenderingData> {
  return {
    ...offerData,
    priceValue: formatUnits(offerData.price, tokenInfo.decimals),
    exchangeTokenSymbol: tokenInfo.symbol,
    sellerDepositValue: formatUnits(
      offerData.sellerDeposit,
      tokenInfo.decimals
    ),
    agentFeeValue: "0", // TODO: get the agentFee of the specified offerData.agentId
    buyerCancelPenaltyValue: formatUnits(
      offerData.buyerCancelPenalty,
      tokenInfo.decimals
    ),
    sellerContactMethod: "TBD", // TODO: what is the sellerContactMethod?
    disputeResolverContactMethod: "TBD", // TODO: what is the disputeResolverContactMethod?
    toISOString: function () {
      return function (num, render) {
        return new Date(parseInt(render(num))).toISOString();
      };
    },
    msecToDay: function () {
      return function (num, render) {
        return BigNumber.from(render(num))
          .div(utils.timestamp.MSEC_PER_DAY)
          .toString();
      };
    }
  };
}

// inject a template + all offer details
export async function renderContractualAgreement(
  template: string,
  offerData: offers.CreateOfferArgs,
  tokenInfo: ITokenInfo
): Promise<string> {
  // Check the passed offerData is matching the required type
  checkOfferDataIsValid(offerData, true);
  const preparedData = await prepareRenderingData(offerData, tokenInfo);
  return Mustache.render(template, preparedData);
}

export async function renderContractualAgreementForOffer(
  existingOfferData: subgraph.OfferFieldsFragment
): Promise<string> {
  if (!existingOfferData) {
    throw new Error(`offerData is undefined`);
  }
  if (!existingOfferData.metadata) {
    throw new Error(`Offer Metadata is undefined`);
  }
  if (existingOfferData.metadata.type !== subgraph.MetadataType.ProductV1) {
    throw new Error(
      `Invalid Offer Metadata: Type is not supported: '${existingOfferData.metadata.type}'`
    );
  }
  if (
    !(existingOfferData.metadata as productV1.ProductV1Metadata).exchangePolicy
  ) {
    throw new Error(`Invalid Offer Metadata: exchangePolicy is not defined`);
  }
  if (
    !(existingOfferData.metadata as productV1.ProductV1Metadata).exchangePolicy
      .template
  ) {
    throw new Error(
      `Invalid Offer Metadata: exchangePolicy.template is not defined`
    );
  }
  const template = (existingOfferData.metadata as productV1.ProductV1Metadata)
    .exchangePolicy.template;
  const convertedOfferArgs = convertExistingOfferData(existingOfferData);
  return renderContractualAgreement(
    template,
    convertedOfferArgs.offerData,
    convertedOfferArgs.tokenInfo
  );
}
