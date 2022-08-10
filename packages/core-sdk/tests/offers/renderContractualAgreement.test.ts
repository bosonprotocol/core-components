import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";
import { CreateOfferArgs } from "./../../../common/src/types/offers";
import { renderContractualAgreement } from "../../src/offers";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import { ITokenInfo } from "../../src/utils/tokenInfoManager";
import { utils } from "@bosonprotocol/common";

const basicTemplate = "Hello World!";

const templates = {
  price: `**Item** means the thing being sold or a set of things being sold together in a single Offer for the price of {{priceValue}} {{exchangeTokenSymbol}}.`,
  sellerDeposit: `**Seller Deposit (Revocation Penalty)** {{sellerDepositValue}} {{exchangeTokenSymbol}}. Means funds deposited by the Seller and locked in the smart contracts. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision.`,
  agentId: `Agent {{agentId}}: An optional third party that takes a fee in successful exchanges (ending in Completed or Retracted states). E.g. a marketplace.`,
  agentFee: `**Agent Fee**`,
  buyerCancelPenalty: `**Seller Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to {{buyerCancelPenaltyValue}} {{exchangeTokenSymbol}}.`,
  validFromTo: `**Offer Validity Period** means the period during which a Buyer may Commit to the Seller’s Offer, which is from  ***{{#toISOString}}{{validFromDateInMS}}{{/toISOString}}*** to ***{{#toISOString}}{{validUntilDateInMS}}{{/toISOString}}***.`,
  redemptionPeriodFromTo: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is from ***{{#toISOString}}{{voucherRedeemableFromDateInMS}}{{/toISOString}}*** to ***{{#toISOString}}{{voucherRedeemableUntilDateInMS}}{{/toISOString}}***.`,
  redemptionPeriodDuration: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is ***{{#msecToDay}}{{voucherValidDurationInMS}}{{/msecToDay}}*** days`,
  resolutionPeriod: `**Resolution Period** means the maximum time period allowed between the date the dispute has been raised (or its clock reset), and the dispute having been resolved, which is within ***{{#msecToDay}}{{resolutionPeriodDurationInMS}}{{/msecToDay}}*** days after the dispute being raised.`,
  fulfillmentPeriod: `**Fulfillment Period** means the time period during which the Seller must fulfill the Offer, which is up to ***{{#msecToDay}}{{fulfillmentPeriodDurationInMS}}{{/msecToDay}}*** days after the NFT Voucher is redeemed.`,
  disputeResolverId: `**Dispute Resolver** means an authority that decides on a dispute between the Parties. The Dispute Resolver hears each side and then decides the outcome of the dispute in accordance with this Buyer and Seller Contractual Agreement. The ID of the DisputeResolver is {{disputeResolverId}}`,
  metadataUri: `**Item** means the thing being sold or a set of things being sold together in a single Offer ***[{{{metadataUri}}}]({{{metadataUri}}})***.`,
  sellerContactMethod: `**Seller Contact Method** means ***{{sellerContactMethod}}***.`,
  disputeResolverContactMethod: `**Dispute Resolution Contact Method** means ***{{disputeResolverContactMethod}}***.`
};

const getTemplateResults = (args: { [key: string]: string }) => {
  return {
    price: `**Item** means the thing being sold or a set of things being sold together in a single Offer for the price of ${args.priceValue} ${args.exchangeTokenSymbol}.`,
    sellerDeposit: `**Seller Deposit (Revocation Penalty)** ${args.sellerDepositValue} ${args.exchangeTokenSymbol}. Means funds deposited by the Seller and locked in the smart contracts. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision.`,
    agentId: `Agent ${args.agentId}: An optional third party that takes a fee in successful exchanges (ending in Completed or Retracted states). E.g. a marketplace.`,
    agentFee: `TBD`,
    buyerCancelPenalty: `**Seller Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to ${args.buyerCancelPenaltyValue} ${args.exchangeTokenSymbol}.`,
    validFromTo: `**Offer Validity Period** means the period during which a Buyer may Commit to the Seller’s Offer, which is from  ***${args.validFromDateInMS}*** to ***${args.validUntilDateInMS}***.`,
    redemptionPeriodFromTo: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is from ***${args.voucherRedeemableFromDateInMS}*** to ***${args.voucherRedeemableUntilDateInMS}***.`,
    redemptionPeriodDuration: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is ***${args.voucherValidDurationInMS}*** days`,
    resolutionPeriod: `**Resolution Period** means the maximum time period allowed between the date the dispute has been raised (or its clock reset), and the dispute having been resolved, which is within ***${args.resolutionPeriodDurationInMS}*** days after the dispute being raised.`,
    fulfillmentPeriod: `**Fulfillment Period** means the time period during which the Seller must fulfill the Offer, which is up to ***${args.fulfillmentPeriodDurationInMS}*** days after the NFT Voucher is redeemed.`,
    disputeResolverId: `**Dispute Resolver** means an authority that decides on a dispute between the Parties. The Dispute Resolver hears each side and then decides the outcome of the dispute in accordance with this Buyer and Seller Contractual Agreement. The ID of the DisputeResolver is ${args.disputeResolverId}`,
    metadataUri: `**Item** means the thing being sold or a set of things being sold together in a single Offer ***[${args.metadataUri}](${args.metadataUri})***.`,
    sellerContactMethod: `TBD`,
    disputeResolverContactMethod: `TBD`
  };
};

const TOKENS = {
  NATIVE: {
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
    address: AddressZero
  },
  BOSON: {
    name: "BOSON",
    decimals: 18,
    symbol: "BOSON",
    address: "0xBosonTokenAddress"
  },
  USDC: {
    name: "USDC",
    decimals: 6,
    symbol: "USDC",
    address: "0xUSDCTokenAddress"
  }
};

const mockTokenInfoManager = {
  getExchangeTokenInfo: async (tokenAddress: string): Promise<ITokenInfo> => {
    const tokenInfo = Object.values(TOKENS).find(
      (t) => t.address === tokenAddress
    );
    if (!tokenInfo) {
      throw new Error(`Unexpected tokenAddress '${tokenAddress}'`);
    }
    return tokenInfo;
  }
};

describe("renderContractualAgreement", () => {
  test("render basicTemplate", async () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs();
    const render = await renderContractualAgreement(
      basicTemplate,
      mockedCreateOfferArgs,
      mockTokenInfoManager
    );
    expect(render).toEqual(basicTemplate);
  });

  // TODO: test offer validity from/to
  // TODO: test offer redemption from/to
  // TODO: test offer redemption duration
  // TODO: test offer in Native Token (ETH)
  // TODO: test offer in ERC20 Token

  describe("render richTemplate", () => {
    let expected: unknown;
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
      const tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
      expected = getTemplateResults({
        priceValue: formatUnits(
          mockedCreateOfferArgs.price,
          tokenInfo.decimals
        ),
        sellerDepositValue: formatUnits(
          mockedCreateOfferArgs.sellerDeposit,
          tokenInfo.decimals
        ).toString(),
        buyerCancelPenaltyValue: formatUnits(
          mockedCreateOfferArgs.buyerCancelPenalty,
          tokenInfo.decimals
        ).toString(),
        agentFeeValue: "TBD",
        exchangeTokenSymbol: tokenInfo.symbol,
        sellerContactMethod: "TBD",
        disputeResolverContactMethod: "TBD",
        agentId: mockedCreateOfferArgs.agentId.toString(),
        disputeResolverId: mockedCreateOfferArgs.disputeResolverId.toString(),
        voucherValidDurationInMS: mockedCreateOfferArgs.voucherValidDurationInMS
          ? BigNumber.from(
              mockedCreateOfferArgs.voucherValidDurationInMS?.toString() as string
            )
              .div(utils.timestamp.MSEC_PER_DAY)
              .toString()
          : "0",
        fulfillmentPeriodDurationInMS: BigNumber.from(
          mockedCreateOfferArgs.fulfillmentPeriodDurationInMS.toString()
        )
          .div(utils.timestamp.MSEC_PER_DAY)
          .toString(),
        metadataUri: mockedCreateOfferArgs.metadataUri,
        voucherRedeemableFromDateInMS: new Date(
          BigNumber.from(
            mockedCreateOfferArgs.voucherRedeemableFromDateInMS
          ).toNumber()
        ).toISOString(),
        voucherRedeemableUntilDateInMS: new Date(
          BigNumber.from(
            mockedCreateOfferArgs.voucherRedeemableUntilDateInMS
          ).toNumber()
        ).toISOString(),
        resolutionPeriodDurationInMS: BigNumber.from(
          mockedCreateOfferArgs.resolutionPeriodDurationInMS
        )
          .div(utils.timestamp.MSEC_PER_DAY)
          .toString(),
        validFromDateInMS: new Date(
          BigNumber.from(mockedCreateOfferArgs.validFromDateInMS).toNumber()
        ).toISOString(),
        validUntilDateInMS: new Date(
          BigNumber.from(mockedCreateOfferArgs.validUntilDateInMS).toNumber()
        ).toISOString()
      });
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).price);
    });

    // TODO: test with offer in BOSON
    // TODO: test with offer in USDC

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).sellerDeposit);
    });

    test("offer AgentId", async () => {
      const render = await renderContractualAgreement(
        templates.agentId,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).agentId);
    });

    xtest("offer AgentFee", async () => {
      const render = await renderContractualAgreement(
        templates.agentFee,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).agentFee);
    });

    test("offer buyerCancelPenalty", async () => {
      const render = await renderContractualAgreement(
        templates.buyerCancelPenalty,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).buyerCancelPenalty);
    });

    test("offer validity from/until", async () => {
      const render = await renderContractualAgreement(
        templates.validFromTo,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).validFromTo);
    });

    test("offer redemptionPeriodFromTo", async () => {
      const render = await renderContractualAgreement(
        templates.redemptionPeriodFromTo,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).redemptionPeriodFromTo);
    });

    test("offer redemptionPeriodDuration", async () => {
      const render = await renderContractualAgreement(
        templates.redemptionPeriodDuration,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).redemptionPeriodDuration);
    });

    test("offer resolutionPeriod", async () => {
      const render = await renderContractualAgreement(
        templates.resolutionPeriod,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).resolutionPeriod);
    });

    test("offer fulfillmentPeriod", async () => {
      const render = await renderContractualAgreement(
        templates.fulfillmentPeriod,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).fulfillmentPeriod);
    });

    test("offer disputeResolverId", async () => {
      const render = await renderContractualAgreement(
        templates.disputeResolverId,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).disputeResolverId);
    });

    test("offer metadataUri", async () => {
      const render = await renderContractualAgreement(
        templates.metadataUri,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).metadataUri);
    });

    xtest("offer sellerContactMethod", async () => {
      const render = await renderContractualAgreement(
        templates.sellerContactMethod,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).sellerContactMethod);
    });

    xtest("offer disputeResolverContactMethod", async () => {
      const render = await renderContractualAgreement(
        templates.disputeResolverContactMethod,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).disputeResolverContactMethod);
    });
  });

  // TODO: check invalid template

  // TODO: check undefined offer details

  // TODO: inject an offerId

  // TODO: check invalid offerId

  // TODO: check nonexisting offer
});
