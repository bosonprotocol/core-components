import { ITokenInfoManager } from "./../utils/tokenInfoManager";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { offers } from "..";
import { utils } from "@bosonprotocol/common";
import Mustache from "mustache";
import { formatUnits } from "ethers/lib/utils";

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

function checkOfferDataIsValid(
  offerData: unknown,
  throwIFInvalid = false
): boolean {
  if (offerData === undefined || offerData === null) {
    throw new Error("InvalidOfferData - undefined");
  }
  if (typeof offerData !== "object") {
    throw new Error("InvalidOfferData - expecting an object");
  }
  const schema: Record<
    keyof Omit<offers.CreateOfferArgs, "voucherValidDurationInMS">,
    string
  > = {
    price: "BigNumberish",
    sellerDeposit: "BigNumberish",
    agentId: "BigNumberish",
    buyerCancelPenalty: "BigNumberish",
    quantityAvailable: "BigNumberish",
    validFromDateInMS: "BigNumberish",
    validUntilDateInMS: "BigNumberish",
    voucherRedeemableFromDateInMS: "BigNumberish",
    voucherRedeemableUntilDateInMS: "BigNumberish",
    fulfillmentPeriodDurationInMS: "BigNumberish",
    resolutionPeriodDurationInMS: "BigNumberish",
    exchangeToken: "string",
    disputeResolverId: "BigNumberish",
    metadataUri: "string",
    metadataHash: "string"
  };
  const missingProperties = Object.keys(schema)
    .filter((key) => offerData[key] === undefined)
    .map((key) => key as keyof offers.CreateOfferArgs)
    .map((key) => `${key}: '${schema[key]}'`);

  if (throwIFInvalid && missingProperties.length > 0) {
    throw new InvalidOfferDataError(missingProperties);
  }

  return missingProperties.length === 0;
}

export async function prepareRenderingData(
  offerData: offers.CreateOfferArgs,
  tokenInfoManager: ITokenInfoManager
): Promise<TemplateRenderingData> {
  const tokenInfo = await tokenInfoManager.getExchangeTokenInfo(
    offerData.exchangeToken
  );
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
  tokenInfoManager: ITokenInfoManager
): Promise<string> {
  // Check the passed offerData is matching the required type
  checkOfferDataIsValid(offerData, true);
  const preparedData = await prepareRenderingData(offerData, tokenInfoManager);
  return Mustache.render(template, preparedData);
}

// TODO: inject an offerId

export async function renderContractualAgreementForOffer(
  offerId: BigNumberish,
  tokenInfoManager: ITokenInfoManager
) {
  // TODO: get the template for the offerId
  const template = "";
  // TODO: get the data for the offerId
  const offerData = undefined;
  return renderContractualAgreement(template, offerData, tokenInfoManager);
}
