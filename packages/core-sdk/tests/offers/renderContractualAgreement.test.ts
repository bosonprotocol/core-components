import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";
import { CreateOfferArgs } from "./../../../common/src/types/offers";
import { renderContractualAgreement } from "../../src/offers";
import { mockCreateOfferArgs } from "@bosonprotocol/common/tests/mocks";
import {
  ITokenInfo,
  ITokenInfoManager
} from "../../src/utils/tokenInfoManager";
import { utils } from "@bosonprotocol/common";

const basicTemplate = "Hello World!";

const templates = {
  price: `**Item** means the thing being sold or a set of things being sold together in a single Offer for the price of {{priceValue}} {{exchangeTokenSymbol}}.`,
  sellerDeposit: `**Seller Deposit (Revocation Penalty)** {{sellerDepositValue}} {{exchangeTokenSymbol}}. Means funds deposited by the Seller and locked in the smart contracts. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision.`,
  agentId: `Agent {{agentId}}: An optional third party that takes a fee in successful exchanges (ending in Completed or Retracted states). E.g. a marketplace.`,
  agentFee: `**Agent Fee**`,
  buyerCancelPenalty: `**Buyer Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to {{buyerCancelPenaltyValue}} {{exchangeTokenSymbol}}.`,
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
    buyerCancelPenalty: `**Buyer Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to ${args.buyerCancelPenaltyValue} ${args.exchangeTokenSymbol}.`,
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

async function mockPrepareRenderingData(
  offerData: CreateOfferArgs,
  tokenInfoManager: ITokenInfoManager
): Promise<{ [key: string]: string }> {
  const tokenInfo = await tokenInfoManager.getExchangeTokenInfo(
    offerData.exchangeToken
  );

  return {
    priceValue: formatUnits(offerData.price, tokenInfo.decimals),
    sellerDepositValue: formatUnits(
      offerData.sellerDeposit,
      tokenInfo.decimals
    ).toString(),
    buyerCancelPenaltyValue: formatUnits(
      offerData.buyerCancelPenalty,
      tokenInfo.decimals
    ).toString(),
    agentFeeValue: "TBD",
    exchangeTokenSymbol: tokenInfo.symbol,
    sellerContactMethod: "TBD",
    disputeResolverContactMethod: "TBD",
    agentId: offerData.agentId.toString(),
    disputeResolverId: offerData.disputeResolverId.toString(),
    voucherValidDurationInMS: offerData.voucherValidDurationInMS
      ? BigNumber.from(offerData.voucherValidDurationInMS?.toString() as string)
          .div(utils.timestamp.MSEC_PER_DAY)
          .toString()
      : "0",
    fulfillmentPeriodDurationInMS: BigNumber.from(
      offerData.fulfillmentPeriodDurationInMS.toString()
    )
      .div(utils.timestamp.MSEC_PER_DAY)
      .toString(),
    metadataUri: offerData.metadataUri,
    voucherRedeemableFromDateInMS: new Date(
      BigNumber.from(offerData.voucherRedeemableFromDateInMS).toNumber()
    ).toISOString(),
    voucherRedeemableUntilDateInMS: new Date(
      BigNumber.from(offerData.voucherRedeemableUntilDateInMS).toNumber()
    ).toISOString(),
    resolutionPeriodDurationInMS: BigNumber.from(
      offerData.resolutionPeriodDurationInMS
    )
      .div(utils.timestamp.MSEC_PER_DAY)
      .toString(),
    validFromDateInMS: new Date(
      BigNumber.from(offerData.validFromDateInMS).toNumber()
    ).toISOString(),
    validUntilDateInMS: new Date(
      BigNumber.from(offerData.validUntilDateInMS).toNumber()
    ).toISOString()
  };
}

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

  describe("render richTemplate", () => {
    let expected: unknown;
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).price);
    });

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

  describe("render richTemplate - offers with BOSON token", () => {
    let expected: unknown;
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs({
        exchangeToken: TOKENS.BOSON.address
      });
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).price);
    });

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).sellerDeposit);
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
  });

  describe("render richTemplate - offers with USDC token", () => {
    let expected: unknown;
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs({
        exchangeToken: TOKENS.USDC.address,
        price: 1000000, // adjust price because USDC decimals is 6, not 18
        sellerDeposit: 100000, // adjust value because USDC decimals is 6, not 18
        buyerCancelPenalty: 200000 // adjust value because USDC decimals is 6, not 18
      });
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).price);
    });

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockTokenInfoManager
      );
      expect(render).toEqual((expected as any).sellerDeposit);
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
  });

  describe("Rendering error cases - invalid templates", () => {
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
    });
    test("invalid template - undefined", async () => {
      const template = undefined;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(
        /^Invalid template! Template should be a "string" but "undefined" was given/
      );
    });
    test("invalid template - number", async () => {
      const template = 123456789;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(
        /^Invalid template! Template should be a "string" but "number" was given/
      );
    });
    test("invalid template - object", async () => {
      const template = { key: "value" };
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(
        /^Invalid template! Template should be a "string" but "object" was given/
      );
    });
    test("invalid template - unclosed tag", async () => {
      const template = `{{placeholder}`;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(/^Unclosed tag at (\d+)/);
    });
    test("invalid template - unclosed tag (again)", async () => {
      const template = `another {{{placeholder}}`;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(/^Unclosed tag at (\d+)/);
    });
  });

  describe("Rendering error cases - other cases", () => {
    const template = "Hello World";
    let mockedCreateOfferArgs: CreateOfferArgs;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
    });
    test("invalid offer data - undefined", async () => {
      await expect(
        renderContractualAgreement(
          template,
          undefined as unknown as CreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(/^InvalidOfferData - undefined/);
    });
    test("invalid offer data - number", async () => {
      await expect(
        renderContractualAgreement(
          template,
          123456789 as unknown as CreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(/^InvalidOfferData - expecting an object/);
    });
    test("invalid offer data - string", async () => {
      await expect(
        renderContractualAgreement(
          template,
          "mockedCreateOfferArgs" as unknown as CreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(/^InvalidOfferData - expecting an object/);
    });
    test("invalid offer data - object", async () => {
      await expect(
        renderContractualAgreement(
          template,
          { key: "mockedCreateOfferArgs" } as unknown as CreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(
        /^InvalidOfferData - missing properties: \[(.*)\]/
      );
    });
    test.each([
      "price",
      "sellerDeposit",
      "agentId",
      "buyerCancelPenalty",
      "quantityAvailable",
      "validFromDateInMS",
      "validUntilDateInMS",
      "voucherRedeemableFromDateInMS",
      "voucherRedeemableUntilDateInMS",
      "fulfillmentPeriodDurationInMS",
      "resolutionPeriodDurationInMS",
      "exchangeToken",
      "disputeResolverId",
      "metadataUri",
      "metadataHash"
    ])("invalid offer data - missing property %s", async (key: string) => {
      const incompleteMockedCreateOfferArgs = Object.assign(
        {},
        mockedCreateOfferArgs
      );
      delete incompleteMockedCreateOfferArgs[key];
      await expect(
        renderContractualAgreement(
          template,
          incompleteMockedCreateOfferArgs,
          mockTokenInfoManager
        )
      ).rejects.toThrowError(
        new RegExp(`^InvalidOfferData - missing properties: \\[${key}: (.*)\\]`)
      );
    });
    test("invalid tokenInfoManager - undefined", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          undefined as unknown as ITokenInfoManager
        )
      ).rejects.toThrowError(/^Cannot read properties of undefined/);
    });
  });

  // TODO: inject an offerId

  // TODO: check invalid offerId

  // TODO: check nonexisting offer
});
