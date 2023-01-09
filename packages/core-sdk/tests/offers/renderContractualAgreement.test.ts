import { MSEC_PER_DAY } from "./../../../common/src/utils/timestamp";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { AddressZero } from "@ethersproject/constants";
import { CreateOfferArgs } from "./../../../common/src/types/offers";
import {
  AdditionalOfferMetadata,
  renderContractualAgreement,
  renderContractualAgreementForOffer
} from "../../src/offers";
import {
  mockAdditionalOfferMetadata,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import { ITokenInfo } from "../../src/utils/tokenInfoManager";
import { utils } from "@bosonprotocol/common";
import { mockRawOfferFromSubgraph, buildProductV1Metadata } from "../mocks";
import { subgraph } from "../../src";

const basicTemplate = "Hello World!";

const templates = {
  price: `**Item** means the thing being sold or a set of things being sold together in a single Offer for the price of {{priceValue}} {{exchangeTokenSymbol}}.`,
  sellerDeposit: `**Seller Deposit (Revocation Penalty)** {{sellerDepositValue}} {{exchangeTokenSymbol}}. Means funds deposited by the Seller and locked in the smart contracts. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision.`,
  agentId: `Agent {{agentId}}: An optional third party that takes a fee in successful exchanges (ending in Completed or Retracted states). E.g. a marketplace.`,
  buyerCancelPenalty: `**Buyer Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to {{buyerCancelPenaltyValue}} {{exchangeTokenSymbol}}.`,
  validFromTo: `**Offer Validity Period** means the period during which a Buyer may Commit to the Seller’s Offer, which is from  ***{{#toISOString}}{{validFromDateInMS}}{{/toISOString}}*** to ***{{#toISOString}}{{validUntilDateInMS}}{{/toISOString}}***.`,
  redemptionPeriodFromTo: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is from ***{{#toISOString}}{{voucherRedeemableFromDateInMS}}{{/toISOString}}*** to ***{{#toISOString}}{{voucherRedeemableUntilDateInMS}}{{/toISOString}}***.`,
  redemptionPeriodDuration: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is ***{{#msecToDay}}{{voucherValidDurationInMS}}{{/msecToDay}}*** days`,
  resolutionPeriod: `**Resolution Period** means the maximum time period allowed between the date the dispute has been raised (or its clock reset), and the dispute having been resolved, which is within ***{{#msecToDay}}{{resolutionPeriodDurationInMS}}{{/msecToDay}}*** days after the dispute being raised.`,
  disputePeriod: `**Dispute Period** means the time period within which the Buyer can raise a dispute. It ends within ***{{#msecToDay}}{{disputePeriodDurationInMS}}{{/msecToDay}}*** days after the Buyer commits to an Offer.`,
  disputeResolverId: `**Dispute Resolver** means an authority that decides on a dispute between the Parties. The Dispute Resolver hears each side and then decides the outcome of the dispute in accordance with this Buyer and Seller Contractual Agreement. The ID of the DisputeResolver is {{disputeResolverId}}`,
  metadataUri: `**Item** means the thing being sold or a set of things being sold together in a single Offer ***[{{{metadataUri}}}]({{{metadataUri}}})***.`,
  sellerContactMethod: `**Seller Contact Method** means ***{{sellerContactMethod}}***.`,
  disputeResolverContactMethod: `**Dispute Resolution Contact Method** means ***{{disputeResolverContactMethod}}***.`,
  escalationDeposit: `**Escalation Deposit** means the funds a Buyer puts down to escalate the Dispute, which becomes part of the Deposit Pool. The Escalation Deposit is set as {{escalationDepositValue}} {{exchangeTokenSymbol}}.`,
  seller: `**Seller** means a person who offers to sell an Item through a rNFT. The Seller is ***{{sellerTradingName}}***.`,
  returnPeriod: `**Return Period** means the period the Buyer must contact the Seller for a return, which is within ***{{returnPeriodInDays}}*** days of delivery of the Item (a minimum of 14 days starting the Buyer receives the Item, if the Seller sells to the EU).`,
  escalationResponsePeriod: `**Escalation Response Period** means the period during which the Dispute Resolver can respond to a Dispute, which is within ***{{#secToDay}}{{escalationResponsePeriodInSec}}{{/secToDay}}*** days after the Buyer escalates the Dispute.`
};

const getTemplateResults = (args: { [key: string]: string }) => {
  return {
    price: `**Item** means the thing being sold or a set of things being sold together in a single Offer for the price of ${args.priceValue} ${args.exchangeTokenSymbol}.`,
    sellerDeposit: `**Seller Deposit (Revocation Penalty)** ${args.sellerDepositValue} ${args.exchangeTokenSymbol}. Means funds deposited by the Seller and locked in the smart contracts. If a dispute happens, those funds can be used to penalize the Seller based on the Dispute Resolver decision.`,
    agentId: `Agent ${args.agentId}: An optional third party that takes a fee in successful exchanges (ending in Completed or Retracted states). E.g. a marketplace.`,
    buyerCancelPenalty: `**Buyer Cancel Penalty** If a Buyer Cancels their commitment before Redeem, they will incur a cancellation penalty equal to ${args.buyerCancelPenaltyValue} ${args.exchangeTokenSymbol}.`,
    validFromTo: `**Offer Validity Period** means the period during which a Buyer may Commit to the Seller’s Offer, which is from  ***${args.validFromDateInMS}*** to ***${args.validUntilDateInMS}***.`,
    redemptionPeriodFromTo: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is from ***${args.voucherRedeemableFromDateInMS}*** to ***${args.voucherRedeemableUntilDateInMS}***.`,
    redemptionPeriodDuration: `**Redemption Period** means the time period after Buyer commits until the NFT Voucher expires, which is ***${args.voucherValidDuration}*** days`,
    resolutionPeriod: `**Resolution Period** means the maximum time period allowed between the date the dispute has been raised (or its clock reset), and the dispute having been resolved, which is within ***${args.resolutionPeriodDuration}*** days after the dispute being raised.`,
    disputePeriod: `**Dispute Period** means the time period within which the Buyer can raise a dispute. It ends within ***${args.disputePeriodDuration}*** days after the Buyer commits to an Offer.`,
    disputeResolverId: `**Dispute Resolver** means an authority that decides on a dispute between the Parties. The Dispute Resolver hears each side and then decides the outcome of the dispute in accordance with this Buyer and Seller Contractual Agreement. The ID of the DisputeResolver is ${args.disputeResolverId}`,
    metadataUri: `**Item** means the thing being sold or a set of things being sold together in a single Offer ***[${args.metadataUri}](${args.metadataUri})***.`,
    sellerContactMethod: `**Seller Contact Method** means ***${args.sellerContactMethod}***.`,
    disputeResolverContactMethod: `**Dispute Resolution Contact Method** means ***${args.disputeResolverContactMethod}***.`,
    escalationDeposit: `**Escalation Deposit** means the funds a Buyer puts down to escalate the Dispute, which becomes part of the Deposit Pool. The Escalation Deposit is set as ${args.escalationDepositValue} ${args.exchangeTokenSymbol}.`,
    seller: `**Seller** means a person who offers to sell an Item through a rNFT. The Seller is ***${args.sellerTradingName}***.`,
    returnPeriod: `**Return Period** means the period the Buyer must contact the Seller for a return, which is within ***${args.returnPeriodInDays}*** days of delivery of the Item (a minimum of 14 days starting the Buyer receives the Item, if the Seller sells to the EU).`,
    escalationResponsePeriod: `**Escalation Response Period** means the period during which the Dispute Resolver can respond to a Dispute, which is within ***${args.escalationResponsePeriod}*** days after the Buyer escalates the Dispute.`
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
  additionalMetadata: AdditionalOfferMetadata,
  tokenInfo: ITokenInfo
): Promise<{ [key: string]: string }> {
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
    exchangeTokenSymbol: tokenInfo.symbol,
    sellerContactMethod: additionalMetadata.sellerContactMethod,
    disputeResolverContactMethod:
      additionalMetadata.disputeResolverContactMethod,
    escalationDepositValue: formatUnits(
      additionalMetadata.escalationDeposit,
      tokenInfo.decimals
    ).toString(),
    agentId: offerData.agentId.toString(),
    disputeResolverId: offerData.disputeResolverId.toString(),
    voucherValidDuration: offerData.voucherValidDurationInMS
      ? BigNumber.from(offerData.voucherValidDurationInMS?.toString() as string)
          .div(utils.timestamp.MSEC_PER_DAY)
          .toString()
      : "0",
    disputePeriodDuration: BigNumber.from(
      offerData.disputePeriodDurationInMS.toString()
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
    resolutionPeriodDuration: BigNumber.from(
      offerData.resolutionPeriodDurationInMS
    )
      .div(utils.timestamp.MSEC_PER_DAY)
      .toString(),
    validFromDateInMS: new Date(
      BigNumber.from(offerData.validFromDateInMS).toNumber()
    ).toISOString(),
    validUntilDateInMS: new Date(
      BigNumber.from(offerData.validUntilDateInMS).toNumber()
    ).toISOString(),
    sellerTradingName: additionalMetadata.sellerTradingName,
    escalationResponsePeriod: BigNumber.from(
      additionalMetadata.escalationResponsePeriodInSec
    )
      .div(utils.timestamp.SEC_PER_DAY)
      .toString(),
    returnPeriodInDays: additionalMetadata.returnPeriodInDays.toString()
  };
}

describe("renderContractualAgreement", () => {
  test("render basicTemplate", async () => {
    const mockedCreateOfferArgs = mockCreateOfferArgs();
    const mockedAdditionalMetadata = mockAdditionalOfferMetadata();
    const tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
      mockedCreateOfferArgs.exchangeToken
    );
    const render = await renderContractualAgreement(
      basicTemplate,
      mockedCreateOfferArgs,
      mockedAdditionalMetadata,
      tokenInfo
    );
    expect(render).toEqual(basicTemplate);
  });

  describe("render richTemplate", () => {
    let expected: unknown;
    let tokenInfo: ITokenInfo;
    let mockedCreateOfferArgs: CreateOfferArgs;
    let mockedAdditionalMetadata: AdditionalOfferMetadata;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
      mockedAdditionalMetadata = mockAdditionalOfferMetadata();
      tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).price);
    });

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).sellerDeposit);
    });

    test("offer AgentId", async () => {
      const render = await renderContractualAgreement(
        templates.agentId,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).agentId);
    });

    test("offer buyerCancelPenalty", async () => {
      const render = await renderContractualAgreement(
        templates.buyerCancelPenalty,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).buyerCancelPenalty);
    });

    test("offer validity from/until", async () => {
      const render = await renderContractualAgreement(
        templates.validFromTo,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).validFromTo);
    });

    test("offer redemptionPeriodFromTo", async () => {
      const render = await renderContractualAgreement(
        templates.redemptionPeriodFromTo,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).redemptionPeriodFromTo);
    });

    test("offer redemptionPeriodDuration", async () => {
      const render = await renderContractualAgreement(
        templates.redemptionPeriodDuration,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).redemptionPeriodDuration);
    });

    test("offer resolutionPeriod", async () => {
      const render = await renderContractualAgreement(
        templates.resolutionPeriod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).resolutionPeriod);
    });

    test("offer disputePeriod", async () => {
      const render = await renderContractualAgreement(
        templates.disputePeriod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).disputePeriod);
    });

    test("offer disputeResolverId", async () => {
      const render = await renderContractualAgreement(
        templates.disputeResolverId,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).disputeResolverId);
    });

    test("offer metadataUri", async () => {
      const render = await renderContractualAgreement(
        templates.metadataUri,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).metadataUri);
    });

    test("offer sellerContactMethod", async () => {
      const render = await renderContractualAgreement(
        templates.sellerContactMethod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).sellerContactMethod);
    });

    test("offer disputeResolverContactMethod", async () => {
      const render = await renderContractualAgreement(
        templates.disputeResolverContactMethod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).disputeResolverContactMethod);
    });

    test("offer escalationDeposit", async () => {
      const render = await renderContractualAgreement(
        templates.escalationDeposit,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).escalationDeposit);
    });

    test("offer seller", async () => {
      const render = await renderContractualAgreement(
        templates.seller,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).seller);
    });

    test("offer returnPeriod", async () => {
      const render = await renderContractualAgreement(
        templates.returnPeriod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).returnPeriod);
    });

    test("offer escalationResponsePeriod", async () => {
      const render = await renderContractualAgreement(
        templates.escalationResponsePeriod,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).escalationResponsePeriod);
    });
  });

  describe("render richTemplate - offers with BOSON token", () => {
    let expected: unknown;
    let tokenInfo: ITokenInfo;
    let mockedCreateOfferArgs: CreateOfferArgs;
    let mockedAdditionalMetadata: AdditionalOfferMetadata;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs({
        exchangeToken: TOKENS.BOSON.address
      });
      mockedAdditionalMetadata = mockAdditionalOfferMetadata();
      tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).price);
    });

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).sellerDeposit);
    });

    test("offer buyerCancelPenalty", async () => {
      const render = await renderContractualAgreement(
        templates.buyerCancelPenalty,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).buyerCancelPenalty);
    });
  });

  describe("render richTemplate - offers with USDC token", () => {
    let expected: unknown;
    let tokenInfo: ITokenInfo;
    let mockedCreateOfferArgs: CreateOfferArgs;
    let mockedAdditionalMetadata: AdditionalOfferMetadata;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs({
        exchangeToken: TOKENS.USDC.address,
        price: 1000000, // adjust price because USDC decimals is 6, not 18
        sellerDeposit: 100000, // adjust value because USDC decimals is 6, not 18
        buyerCancelPenalty: 200000 // adjust value because USDC decimals is 6, not 18
      });
      mockedAdditionalMetadata = mockAdditionalOfferMetadata();
      tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
      expected = getTemplateResults(
        await mockPrepareRenderingData(
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      );
    });

    test("offer price", async () => {
      const render = await renderContractualAgreement(
        templates.price,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).price);
    });

    test("offer Seller Deposit", async () => {
      const render = await renderContractualAgreement(
        templates.sellerDeposit,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).sellerDeposit);
    });

    test("offer buyerCancelPenalty", async () => {
      const render = await renderContractualAgreement(
        templates.buyerCancelPenalty,
        mockedCreateOfferArgs,
        mockedAdditionalMetadata,
        tokenInfo
      );
      expect(render).toEqual((expected as any).buyerCancelPenalty);
    });
  });

  describe("Rendering error cases - invalid templates", () => {
    let tokenInfo: ITokenInfo;
    let mockedCreateOfferArgs: CreateOfferArgs;
    let mockedAdditionalMetadata: AdditionalOfferMetadata;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
      mockedAdditionalMetadata = mockAdditionalOfferMetadata();
      tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
    });
    test("invalid template - undefined", async () => {
      const template = undefined;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
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
          mockedAdditionalMetadata,
          tokenInfo
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
          mockedAdditionalMetadata,
          tokenInfo
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
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^Unclosed tag at (\d+)/);
    });
    test("invalid template - unclosed tag (again)", async () => {
      const template = `another {{{placeholder}}`;
      await expect(
        renderContractualAgreement(
          template as unknown as string,
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^Unclosed tag at (\d+)/);
    });
  });

  describe("Rendering error cases - other cases", () => {
    const template = "Hello World";
    let tokenInfo: ITokenInfo;
    let mockedCreateOfferArgs: CreateOfferArgs;
    let mockedAdditionalMetadata: AdditionalOfferMetadata;
    beforeEach(async () => {
      mockedCreateOfferArgs = mockCreateOfferArgs();
      mockedAdditionalMetadata = mockAdditionalOfferMetadata();
      tokenInfo = await mockTokenInfoManager.getExchangeTokenInfo(
        mockedCreateOfferArgs.exchangeToken
      );
    });
    test("invalid offer data - undefined", async () => {
      await expect(
        renderContractualAgreement(
          template,
          undefined as unknown as CreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferData - undefined/);
    });
    test("invalid offer metadata - undefined", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          undefined as unknown as AdditionalOfferMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferMetadata - undefined/);
    });
    test("invalid offer data - number", async () => {
      await expect(
        renderContractualAgreement(
          template,
          123456789 as unknown as CreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferData - expecting an object/);
    });
    test("invalid offer metadata - number", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          123456789 as unknown as AdditionalOfferMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferMetadata - expecting an object/);
    });
    test("invalid offer data - string", async () => {
      await expect(
        renderContractualAgreement(
          template,
          "mockedCreateOfferArgs" as unknown as CreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferData - expecting an object/);
    });
    test("invalid offer metadata - string", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          "mockedAdditionalMetadata" as unknown as AdditionalOfferMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(/^InvalidOfferMetadata - expecting an object/);
    });
    test("invalid offer data - object", async () => {
      await expect(
        renderContractualAgreement(
          template,
          { key: "mockedCreateOfferArgs" } as unknown as CreateOfferArgs,
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(
        /^InvalidOfferData - missing properties: \[(.*)\]/
      );
    });
    test("invalid offer metadata - object", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          {
            key: "mockedAdditionalMetadata"
          } as unknown as AdditionalOfferMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(
        /^InvalidOfferMetadata - missing properties: \[(.*)\]/
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
      "disputePeriodDurationInMS",
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
          mockedAdditionalMetadata,
          tokenInfo
        )
      ).rejects.toThrowError(
        new RegExp(`^InvalidOfferData - missing properties: \\[${key}\\]`)
      );
    });
    test.each([
      "sellerContactMethod",
      "disputeResolverContactMethod",
      "escalationDeposit",
      "escalationResponsePeriodInSec",
      "sellerTradingName",
      "returnPeriodInDays"
    ])("invalid offer metadata - missing property %s", async (key: string) => {
      const incompleteMockedAdditionalMetadataArgs = Object.assign(
        {},
        mockedAdditionalMetadata
      );
      delete incompleteMockedAdditionalMetadataArgs[key];
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          incompleteMockedAdditionalMetadataArgs,
          tokenInfo
        )
      ).rejects.toThrowError(
        new RegExp(`^InvalidOfferMetadata - missing properties: \\[${key}\\]`)
      );
    });
    test("invalid tokenInfo - undefined", async () => {
      await expect(
        renderContractualAgreement(
          template,
          mockedCreateOfferArgs,
          mockedAdditionalMetadata,
          undefined as unknown as ITokenInfo
        )
      ).rejects.toThrowError(/^Cannot read properties of undefined/);
    });
  });
});

describe("renderContractualAgreementForOffer", () => {
  test("render basicTemplate", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
      metadata: buildProductV1Metadata(basicTemplate)
    });
    const render = await renderContractualAgreementForOffer(
      mockedRawOfferFromSubgraph
    );
    expect(render).toEqual(basicTemplate);
  });

  describe("render richTemplate", () => {
    test("offer price", async () => {
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
        price: "100" + "0".repeat(18),
        metadata: buildProductV1Metadata(
          "{{priceValue}} {{exchangeTokenSymbol}}"
        )
      });
      const render = await renderContractualAgreementForOffer(
        mockedRawOfferFromSubgraph
      );
      expect(render).toEqual("100.0 ETH");
    });

    test("offer redemptionPeriodFromTo", async () => {
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
        voucherRedeemableFromDate: "1660237512000",
        metadata: buildProductV1Metadata(
          "{{#toISOString}}{{voucherRedeemableFromDateInMS}}{{/toISOString}}"
        )
      });
      const render = await renderContractualAgreementForOffer(
        mockedRawOfferFromSubgraph
      );
      expect(render).toEqual("2022-08-11T17:05:12.000Z");
    });

    test("offer resolutionPeriod", async () => {
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
        resolutionPeriodDuration: (30 * MSEC_PER_DAY).toString(),
        metadata: buildProductV1Metadata(
          "{{#msecToDay}}{{resolutionPeriodDurationInMS}}{{/msecToDay}}"
        )
      });
      const render = await renderContractualAgreementForOffer(
        mockedRawOfferFromSubgraph
      );
      expect(render).toEqual("30");
    });
  });

  describe("Rendering error cases", () => {
    test("BASE Type Metadata is not supported", async () => {
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph();
      expect(mockedRawOfferFromSubgraph.metadata?.type).toEqual(
        subgraph.MetadataType.Base
      );
      await expect(
        renderContractualAgreementForOffer(mockedRawOfferFromSubgraph)
      ).rejects.toThrowError(
        /^Invalid Offer Metadata: Type is not supported: 'BASE'/
      );
    });

    test("exchangePolicy is not defined", async () => {
      const metadata = buildProductV1Metadata(basicTemplate);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any).exchangePolicy = undefined;
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({ metadata });

      expect(mockedRawOfferFromSubgraph.metadata?.type).toEqual(
        subgraph.MetadataType.ProductV1
      );
      await expect(
        renderContractualAgreementForOffer(mockedRawOfferFromSubgraph)
      ).rejects.toThrowError(
        /^Invalid Offer Metadata: exchangePolicy is not defined/
      );
    });

    test("exchangePolicy.template is not defined", async () => {
      const metadata = buildProductV1Metadata(basicTemplate);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any).exchangePolicy.template = undefined;
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({ metadata });

      expect(mockedRawOfferFromSubgraph.metadata?.type).toEqual(
        subgraph.MetadataType.ProductV1
      );
      await expect(
        renderContractualAgreementForOffer(mockedRawOfferFromSubgraph)
      ).rejects.toThrowError(
        /^Invalid Offer Metadata: exchangePolicy.template is not defined/
      );
    });

    test("metadata is not defined", async () => {
      const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph();
      mockedRawOfferFromSubgraph.metadata = null;
      await expect(
        renderContractualAgreementForOffer(mockedRawOfferFromSubgraph)
      ).rejects.toThrowError(/^Offer Metadata is undefined/);
    });
  });
});
