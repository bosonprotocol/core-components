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

// TODO: inject a template + all offer details
export async function renderContractualAgreement(
  template: string,
  offerData: offers.CreateOfferArgs,
  tokenInfoManager: ITokenInfoManager
): Promise<string> {
  const preparedData = await prepareRenderingData(offerData, tokenInfoManager);
  return Mustache.render(template, preparedData);
}

// TODO inject an offerId

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
