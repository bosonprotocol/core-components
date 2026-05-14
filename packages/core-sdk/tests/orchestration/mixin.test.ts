import { AuthTokenType } from "@bosonprotocol/common";
import {
  ADDRESS,
  MockWeb3LibAdapter,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import { CoreSDK } from "../../src/core-sdk";
import * as orchestrationHandler from "../../src/orchestration/handler";
import { SUBGRAPH_URL, ZERO_ADDRESS } from "../mocks";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAIN_ID = 31337;
const PROTOCOL_DIAMOND = "0x0000000000000000000000000000000000000001";
const CUSTOM_CONTRACT = "0x0000000000000000000000000000000000000099";
const SIGNER = "0x0000000000000000000000000000000000000004";
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

const sellerToCreate = {
  assistant: ADDRESS,
  admin: ADDRESS,
  treasury: ADDRESS,
  contractUri: "ipfs://contract-uri",
  royaltyPercentage: "0",
  authTokenId: "0",
  authTokenType: AuthTokenType.NONE,
  metadataUri: "ipfs://seller-metadata"
};

const conditionStruct = {
  method: 0,
  tokenType: 0,
  tokenAddress: ZERO_ADDRESS,
  gatingType: 0,
  minTokenId: "0",
  maxTokenId: "0",
  threshold: "0",
  maxCommits: "0"
};

const premintParameters = {
  reservedRangeLength: "1",
  to: ADDRESS
};

// ─── Factory ──────────────────────────────────────────────────────────────────

function makeCoreSDK() {
  return new CoreSDK({
    web3Lib: new MockWeb3LibAdapter({
      getSignerAddress: SIGNER,
      call: ABI_UINT256_ONE
    }),
    subgraphUrl: SUBGRAPH_URL,
    protocolDiamond: PROTOCOL_DIAMOND,
    chainId: CHAIN_ID
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stubResolved = {} as any;

afterEach(() => {
  jest.restoreAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("OrchestrationMixin#createOfferWithCondition()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferWithCondition(
      mockCreateOfferArgs(),
      conditionStruct
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        condition: conditionStruct,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferWithCondition(
      mockCreateOfferArgs(),
      conditionStruct,
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferWithCondition(
      mockCreateOfferArgs(),
      conditionStruct,
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createSellerAndOfferWithCondition()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      conditionStruct
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        sellerToCreate,
        condition: conditionStruct,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      conditionStruct,
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      conditionStruct,
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createPremintedOfferAddToGroup()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferAddToGroup")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferAddToGroup(
      mockCreateOfferArgs(),
      premintParameters,
      "5"
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        premintParameters,
        groupId: "5",
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferAddToGroup")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferAddToGroup(
      mockCreateOfferArgs(),
      premintParameters,
      "5",
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferAddToGroup")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferAddToGroup(
      mockCreateOfferArgs(),
      premintParameters,
      "5",
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createSellerAndPremintedOffer()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOffer")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOffer(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        sellerToCreate,
        premintParameters,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOffer")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOffer(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters,
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOffer")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOffer(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters,
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createPremintedOfferWithCondition()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferWithCondition(
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        premintParameters,
        condition: conditionStruct,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferWithCondition(
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct,
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createPremintedOfferWithCondition(
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct,
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createSellerAndPremintedOfferWithCondition()", () => {
  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        sellerToCreate,
        premintParameters,
        condition: conditionStruct,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct,
      { contractAddress: CUSTOM_CONTRACT }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createSellerAndPremintedOfferWithCondition")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createSellerAndPremintedOfferWithCondition(
      sellerToCreate,
      mockCreateOfferArgs(),
      premintParameters,
      conditionStruct,
      { returnTxInfo: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#commitToOfferAndRedeemVoucher()", () => {
  test("defaults contractAddress to protocolDiamond and injects subgraphUrl", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToOfferAndRedeemVoucher(1);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToOfferAndRedeemVoucher(1, {
      contractAddress: CUSTOM_CONTRACT
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToOfferAndRedeemVoucher(1, {
      returnTxInfo: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#commitToConditionalOfferAndRedeemVoucher()", () => {
  test("defaults contractAddress to protocolDiamond and forwards offerId/tokenId", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToConditionalOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToConditionalOfferAndRedeemVoucher(1, 42);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        subgraphUrl: SUBGRAPH_URL,
        offerId: 1,
        tokenId: 42,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToConditionalOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToConditionalOfferAndRedeemVoucher(1, 42, {
      contractAddress: CUSTOM_CONTRACT
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "commitToConditionalOfferAndRedeemVoucher")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().commitToConditionalOfferAndRedeemVoucher(1, 42, {
      returnTxInfo: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#createOfferCommitAndRedeem()", () => {
  const fullOfferArgs = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(mockCreateOfferArgs() as any),
    offerCreator: ADDRESS,
    committer: ADDRESS,
    condition: conditionStruct,
    useDepositedFunds: false,
    signature: "0xdeadbeef",
    sellerId: "1",
    buyerId: "1",
    feeLimit: "0",
    mutualizerAddress: ZERO_ADDRESS,
    sellerOfferParams: {
      collectionIndex: "0",
      royaltyInfo: { recipients: [ZERO_ADDRESS], bps: ["0"] },
      mutualizerAddress: ZERO_ADDRESS
    }
  };

  test("defaults contractAddress to protocolDiamond", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferCommitAndRedeem")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferCommitAndRedeem(fullOfferArgs);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        subgraphUrl: SUBGRAPH_URL,
        createOfferAndCommitArgs: fullOfferArgs,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferCommitAndRedeem")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferCommitAndRedeem(fullOfferArgs, {
      contractAddress: CUSTOM_CONTRACT
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards txRequest override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferCommitAndRedeem")
      .mockResolvedValueOnce(stubResolved);

    const txRequest = { to: CUSTOM_CONTRACT, data: "0x00", value: "1" };

    await makeCoreSDK().createOfferCommitAndRedeem(fullOfferArgs, {
      txRequest
    });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ txRequest }));
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "createOfferCommitAndRedeem")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().createOfferCommitAndRedeem(fullOfferArgs, {
      returnTxInfo: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});

describe("OrchestrationMixin#raiseAndEscalateDispute()", () => {
  test("defaults contractAddress to protocolDiamond and forwards exchangeId", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "raiseAndEscalateDispute")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().raiseAndEscalateDispute(7);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: PROTOCOL_DIAMOND,
        exchangeId: 7,
        returnTxInfo: false
      })
    );
  });

  test("honors contractAddress override", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "raiseAndEscalateDispute")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().raiseAndEscalateDispute(7, {
      contractAddress: CUSTOM_CONTRACT
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ contractAddress: CUSTOM_CONTRACT })
    );
  });

  test("forwards returnTxInfo: true", async () => {
    const spy = jest
      .spyOn(orchestrationHandler, "raiseAndEscalateDispute")
      .mockResolvedValueOnce(stubResolved);

    await makeCoreSDK().raiseAndEscalateDispute(7, { returnTxInfo: true });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTxInfo: true })
    );
  });
});
