import {
  AuthTokenType,
  EvaluationMethod,
  GatingType,
  TokenType,
  abis
} from "@bosonprotocol/common";
import {
  MockWeb3LibAdapter,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import { AddressZero } from "@ethersproject/constants";
import { CoreSDK } from "../../src/core-sdk";
import * as metaTxHandler from "../../src/meta-tx/handler";
import { StructuredData } from "../../src/utils/signature";
import {
  BICONOMY_URL,
  SUBGRAPH_URL,
  ZERO_ADDRESS,
  interceptSubgraph,
  mockRawOfferFromSubgraph,
  mockRawSellerFromSubgraph
} from "../mocks";

jest.setTimeout(30_000);

// ─── Shared constants ─────────────────────────────────────────────────────────

const CHAIN_ID = 31337; // local chain → takes the isLocal(chainId) path in handler
const PROTOCOL_DIAMOND = "0x0000000000000000000000000000000000000001";
const PRICE_DISCOVERY = "0x0000000000000000000000000000000000000002";
const FORWARDER = "0x0000000000000000000000000000000000000003";
const SIGNER = "0x0000000000000000000000000000000000000004";
const VOUCHER_CLONE = "0x0000000000000000000000000000000000000005";
const ASSISTANT = "0x0000000000000000000000000000000000000006";
// A real-looking ECDSA signature returned by MockWeb3LibAdapter.send()
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";
// ABI-encoded uint256(1) – used as the forwarder getNonce() response
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// ─── Factory helpers ──────────────────────────────────────────────────────────

function makeCoreSDK() {
  return new CoreSDK({
    web3Lib: new MockWeb3LibAdapter({
      getSignerAddress: SIGNER,
      send: MOCK_SIG,
      call: ABI_UINT256_ONE
    }),
    subgraphUrl: SUBGRAPH_URL,
    protocolDiamond: PROTOCOL_DIAMOND,
    chainId: CHAIN_ID,
    metaTx: {
      relayerUrl: BICONOMY_URL,
      apiKey: "test-api-key",
      apiIds: {
        [PROTOCOL_DIAMOND.toLowerCase()]: {
          executeMetaTransaction: "test-api-id"
        }
      },
      forwarderAbi: abis.MockForwarderABI
    },
    contracts: {
      protocolDiamond: PROTOCOL_DIAMOND,
      priceDiscoveryClient: PRICE_DISCOVERY,
      forwarder: FORWARDER
    }
  });
}

/**
 * Generic StructuredData shape assertion for mixin-level tests.
 * Verifies the mixin correctly injected PROTOCOL_DIAMOND as verifyingContract.
 */
function assertStructuredDataShape(
  result: unknown,
  expectedPrimaryType?: string
) {
  const d = result as StructuredData;
  expect(d.domain.verifyingContract).toBe(PROTOCOL_DIAMOND);
  expect(typeof d.primaryType).toBe("string");
  if (expectedPrimaryType) expect(d.primaryType).toBe(expectedPrimaryType);
  expect(typeof d.message).toBe("object");
  // Must NOT look like a SignedMetaTx
  expect((d as unknown as { r?: unknown }).r).toBeUndefined();
}

function assertSignedMetaTx(result: unknown) {
  const r = result as {
    r: string;
    s: string;
    v: number;
    functionName: string;
    functionSignature: string;
  };
  expect(typeof r.r).toBe("string");
  expect(typeof r.s).toBe("string");
  expect(typeof r.v).toBe("number");
  expect(typeof r.functionName).toBe("string");
  expect(typeof r.functionSignature).toBe("string");
}

// ─── 1. signMetaTxCommitToOffer ───────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxCommitToOffer()", () => {
  const OFFER_ID = "1";
  const NONCE = 1;

  test("offer without condition → calls direct commitToOffer path", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: mockRawOfferFromSubgraph() } // condition defaults to undefined
    });
    const sdk = makeCoreSDK();
    const result = await sdk.signMetaTxCommitToOffer({
      offerId: OFFER_ID,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe("commitToOffer(address,uint256)");
  });

  test("offer with condition → redirects to commitToConditionalOffer using condition.minTokenId as tokenId", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          condition: {
            id: "1-condition",
            method: 1,
            tokenType: 1,
            tokenAddress: ZERO_ADDRESS,
            gatingType: 0,
            minTokenId: "42",
            maxTokenId: "42",
            threshold: "1",
            maxCommits: "1"
          } as any
        })
      }
    });
    const sdk = makeCoreSDK();
    const result = await sdk.signMetaTxCommitToOffer({
      offerId: OFFER_ID,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe(
      "commitToConditionalOffer(address,uint256,uint256)"
    );
  });

  test("offer without condition, returnTypedDataToSign: true → returns StructuredData for commitToOffer", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: mockRawOfferFromSubgraph() }
    });
    const sdk = makeCoreSDK();
    // Cast needed: TypeScript overload resolution struggles with the complex Omit<Parameters<...>> pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (sdk.signMetaTxCommitToOffer as any)({
      offerId: OFFER_ID,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("MetaTxCommitToOffer");
    expect(data.domain.verifyingContract).toBe(PROTOCOL_DIAMOND);
  });

  test("offer with condition, returnTypedDataToSign: true → returns StructuredData for commitToConditionalOffer", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: {
        offer: mockRawOfferFromSubgraph({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          condition: {
            id: "1-condition",
            method: 1,
            tokenType: 1,
            tokenAddress: ZERO_ADDRESS,
            gatingType: 0,
            minTokenId: "7",
            maxTokenId: "7",
            threshold: "1",
            maxCommits: "1"
          } as any
        })
      }
    });
    const sdk = makeCoreSDK();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (sdk.signMetaTxCommitToOffer as any)({
      offerId: OFFER_ID,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("MetaTxCommitToConditionalOffer");
  });
});

// ─── 2. signMetaTxReserveRange ────────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxReserveRange()", () => {
  const OFFER_ID = "1";
  const NONCE = 1;
  const LENGTH = "100";

  // Partial seller via `as any` because mockRawOfferFromSubgraph expects the full seller shape
  // but the spread inside the mock helper merges these overrides correctly at runtime.
  const offerWithAddresses = mockRawOfferFromSubgraph({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seller: { assistant: ASSISTANT, voucherCloneAddress: VOUCHER_CLONE } as any
  });

  test('to: "seller" → passes offer.seller.assistant as the `to` address to the handler', async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithAddresses }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxReserveRange")
      .mockResolvedValueOnce({
        r: "0x",
        s: "0x",
        v: 0,
        functionName: "reserveRange(uint256,uint256,address)",
        functionSignature: "0x"
      });
    const sdk = makeCoreSDK();

    await sdk.signMetaTxReserveRange({
      offerId: OFFER_ID,
      length: LENGTH,
      to: "seller",
      nonce: NONCE
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ to: ASSISTANT })
    );
    spy.mockRestore();
  });

  test('to: "contract" → passes offer.seller.voucherCloneAddress as the `to` address to the handler', async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithAddresses }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxReserveRange")
      .mockResolvedValueOnce({
        r: "0x",
        s: "0x",
        v: 0,
        functionName: "reserveRange(uint256,uint256,address)",
        functionSignature: "0x"
      });
    const sdk = makeCoreSDK();

    await sdk.signMetaTxReserveRange({
      offerId: OFFER_ID,
      length: LENGTH,
      to: "contract",
      nonce: NONCE
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ to: VOUCHER_CLONE })
    );
    spy.mockRestore();
  });

  test('to: "seller", returnTypedDataToSign: true → passes returnTypedDataToSign: true to the handler', async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithAddresses }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxReserveRange")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);
    const sdk = makeCoreSDK();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (sdk.signMetaTxReserveRange as any)({
      offerId: OFFER_ID,
      length: LENGTH,
      to: "seller",
      nonce: NONCE,
      returnTypedDataToSign: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ to: ASSISTANT, returnTypedDataToSign: true })
    );
    spy.mockRestore();
  });
});

// ─── 3. signMetaTxUpdateSellerAndOptIn ───────────────────────────────────────

describe("MetaTxMixin#signMetaTxUpdateSellerAndOptIn()", () => {
  const sellerUpdates = {
    id: "1",
    assistant: SIGNER,
    admin: SIGNER,
    treasury: SIGNER,
    authTokenId: "0",
    authTokenType: AuthTokenType.NONE,
    metadataUri: "ipfs://seller-metadata"
  };

  // Mock TransactionResponse objects returned by relayMetaTransaction
  const mockUpdateTx = {
    hash: "0xupdate",
    wait: jest.fn().mockResolvedValue({ transactionHash: "0xupdate" })
  };
  const mockOptInTx = {
    hash: "0xopt-in",
    wait: jest.fn().mockResolvedValue({ transactionHash: "0xopt-in" })
  };

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  /**
   * Spy on the SDK instance methods that hit Biconomy / the handler,
   * so tests focus on the orchestration logic rather than HTTP plumbing.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function spyOnRelayAndSign(sdk: any) {
    let relayCount = 0;
    jest
      .spyOn(sdk, "relayMetaTransaction")
      .mockImplementation(async () =>
        relayCount++ === 0 ? mockUpdateTx : mockOptInTx
      );

    jest.spyOn(sdk, "signMetaTxUpdateSeller").mockResolvedValue({
      functionName:
        "updateSeller((uint256,address,address,address,address,uint256,uint8))",
      functionSignature: "0xabcd",
      r: "0x",
      s: "0x",
      v: 27
    });

    jest.spyOn(sdk, "signMetaTxOptInToSellerUpdate").mockResolvedValue({
      functionName: "optInToSellerUpdate(uint256,(bool,bool,bool))",
      functionSignature: "0xdead",
      r: "0x",
      s: "0x",
      v: 27
    });
  }

  test("throws when seller cannot be retrieved after polling exhausts", async () => {
    const sdk = makeCoreSDK();
    spyOnRelayAndSign(sdk);
    // getSellerById always returns null → while loop exhausts count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(sdk as any, "getSellerById").mockResolvedValue(null);

    jest.useFakeTimers();
    const promise = sdk.signMetaTxUpdateSellerAndOptIn(sellerUpdates);
    // Attach the rejection handler BEFORE advancing timers to prevent unhandledRejection
    const check = expect(promise).rejects.toThrow(
      "[signMetaTxUpdateSellerAndOptIn] seller could not be retrieved in time"
    );
    // Fire all 200 setTimeout(resolve, 300) calls in the polling loop
    await jest.runAllTimersAsync();
    await check;
  });

  test("throws when seller.pendingSeller is null after polling exhausts", async () => {
    const sdk = makeCoreSDK();
    spyOnRelayAndSign(sdk);
    // Seller exists but pendingSeller is always null → loop exhausts count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest
      .spyOn(sdk as any, "getSellerById")
      .mockResolvedValue(mockRawSellerFromSubgraph({ pendingSeller: null }));

    jest.useFakeTimers();
    const promise = sdk.signMetaTxUpdateSellerAndOptIn(sellerUpdates);
    // Attach rejection handler before advancing timers
    const check = expect(promise).rejects.toThrow(
      "[signMetaTxUpdateSellerAndOptIn] seller.pendingSeller could not be retrieved in time"
    );
    await jest.runAllTimersAsync();
    await check;
  });

  test("when currentAccount matches pendingSeller.assistant → relays opt-in tx and returns it", async () => {
    const sdk = makeCoreSDK();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdkAny = sdk as any;
    spyOnRelayAndSign(sdkAny);
    // First poll: seller found with pendingSeller.assistant === SIGNER → exits while loop
    jest.spyOn(sdkAny, "getSellerById").mockResolvedValue(
      mockRawSellerFromSubgraph({
        pendingSeller: {
          assistant: SIGNER,
          admin: "0x000000000000000000000000000000000000dead",
          clerk: null,
          authTokenId: "0",
          authTokenType: AuthTokenType.NONE
        }
      })
    );

    const tx = await sdk.signMetaTxUpdateSellerAndOptIn(sellerUpdates);

    expect(tx).toBeDefined();
    expect(typeof tx.wait).toBe("function");
    // opt-in relay was called: relayMetaTransaction invoked twice (updateSeller + optIn)
    expect(sdkAny.relayMetaTransaction).toHaveBeenCalledTimes(2);
  });

  test("when no pendingSeller fields match current account → returns updateSeller tx directly", async () => {
    const sdk = makeCoreSDK();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdkAny = sdk as any;
    spyOnRelayAndSign(sdkAny);
    // pendingSeller has neither assistant/admin matching SIGNER, authTokenType is NONE
    jest.spyOn(sdkAny, "getSellerById").mockResolvedValue(
      mockRawSellerFromSubgraph({
        pendingSeller: {
          assistant: "0x000000000000000000000000000000000000dead",
          admin: "0x000000000000000000000000000000000000dead",
          clerk: null,
          authTokenId: "0",
          authTokenType: AuthTokenType.NONE
        }
      })
    );

    const tx = await sdk.signMetaTxUpdateSellerAndOptIn(sellerUpdates);

    expect(tx).toBeDefined();
    expect(typeof tx.wait).toBe("function");
    // No opt-in: relayMetaTransaction was called only once (update only)
    expect(sdkAny.relayMetaTransaction).toHaveBeenCalledTimes(1);
  });
});

// ─── 4. signMetaTxPreMint ─────────────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxPreMint()", () => {
  const offerWithVoucher = mockRawOfferFromSubgraph({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seller: { voucherCloneAddress: VOUCHER_CLONE } as any
  });

  const mockVoucherMetaTxResult = {
    to: VOUCHER_CLONE,
    functionSignature: "0x",
    signature: "0x",
    request: { from: SIGNER, to: VOUCHER_CLONE, nonce: "0", data: "0x" },
    r: "0x",
    s: "0x",
    v: 0
  };

  test("resolves bosonVoucherAddress from offer.seller.voucherCloneAddress", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithVoucher }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxPreMint")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxPreMint({ offerId: "1", amount: "5" });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        bosonVoucherAddress: VOUCHER_CLONE,
        forwarderAddress: FORWARDER
      })
    );
    spy.mockRestore();
  });

  test("defaults batchId to 0 when no override is provided", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithVoucher }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxPreMint")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxPreMint({ offerId: "1", amount: "5" });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ batchId: 0 }));
    spy.mockRestore();
  });

  test("uses batchId override when provided", async () => {
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: { offer: offerWithVoucher }
    });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxPreMint")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxPreMint({ offerId: "1", amount: "5" }, { batchId: 7 });

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ batchId: 7 }));
    spy.mockRestore();
  });
});

// ─── 5. signMetaTxSetApprovalForAll ──────────────────────────────────────────

describe("MetaTxMixin#signMetaTxSetApprovalForAll()", () => {
  const sellerFromSubgraph = mockRawSellerFromSubgraph({
    assistant: SIGNER,
    voucherCloneAddress: VOUCHER_CLONE
  });

  const mockVoucherMetaTxResult = {
    to: VOUCHER_CLONE,
    functionSignature: "0x",
    signature: "0x",
    request: { from: SIGNER, to: VOUCHER_CLONE, nonce: "0", data: "0x" },
    r: "0x",
    s: "0x",
    v: 0
  };

  test("resolves bosonVoucherAddress via subgraph getSellerByAddress", async () => {
    // getSellerByAddress makes two parallel getSellersQuery calls (assistant + admin lookup)
    interceptSubgraph("getSellersQuery")
      .times(2)
      .reply(200, { data: { sellers: [sellerFromSubgraph] } });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxSetApprovalForAll")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxSetApprovalForAll({
      operator: ZERO_ADDRESS,
      approved: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        bosonVoucherAddress: VOUCHER_CLONE,
        forwarderAddress: FORWARDER
      })
    );
    spy.mockRestore();
  });
});

// ─── 6. signMetaTxSetApprovalForAllToContract ─────────────────────────────────

describe("MetaTxMixin#signMetaTxSetApprovalForAllToContract()", () => {
  const sellerFromSubgraph = mockRawSellerFromSubgraph({
    assistant: SIGNER,
    voucherCloneAddress: VOUCHER_CLONE
  });

  const mockVoucherMetaTxResult = {
    to: VOUCHER_CLONE,
    functionSignature: "0x",
    signature: "0x",
    request: { from: SIGNER, to: VOUCHER_CLONE, nonce: "0", data: "0x" },
    r: "0x",
    s: "0x",
    v: 0
  };

  // The mixin always fetches seller from subgraph, even when args.bosonVoucherAddress is provided
  function interceptSellersQuery() {
    interceptSubgraph("getSellersQuery")
      .times(2)
      .reply(200, { data: { sellers: [sellerFromSubgraph] } });
  }

  test("without explicit bosonVoucherAddress → uses seller.voucherCloneAddress from subgraph", async () => {
    interceptSellersQuery();
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxSetApprovalForAllToContract")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxSetApprovalForAllToContract({
      operator: ZERO_ADDRESS,
      approved: true
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ bosonVoucherAddress: VOUCHER_CLONE }),
      expect.anything()
    );
    spy.mockRestore();
  });

  test("with explicit bosonVoucherAddress → uses the provided address, not the subgraph value", async () => {
    const EXPLICIT_VOUCHER = "0x0000000000000000000000000000000000000099";
    interceptSellersQuery();
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxSetApprovalForAllToContract")
      .mockResolvedValueOnce({
        ...mockVoucherMetaTxResult,
        to: EXPLICIT_VOUCHER
      });
    const sdk = makeCoreSDK();

    await sdk.signMetaTxSetApprovalForAllToContract({
      operator: ZERO_ADDRESS,
      approved: true,
      bosonVoucherAddress: EXPLICIT_VOUCHER
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ bosonVoucherAddress: EXPLICIT_VOUCHER }),
      expect.anything()
    );
    spy.mockRestore();
  });
});

// ─── Tier 2 shared fixtures ──────────────────────────────────────────────────

const TOKEN = "0x0000000000000000000000000000000000000002";
const NONCE = 1;
const VALID_UNTIL = Math.floor(Date.now() / 1000) + 3600;

const createSellerArgsMock = {
  assistant: SIGNER,
  admin: SIGNER,
  treasury: SIGNER,
  contractUri: "ipfs://contract-uri",
  royaltyPercentage: "0",
  authTokenId: "0",
  authTokenType: AuthTokenType.NONE,
  metadataUri: "ipfs://seller-metadata"
};

const updateSellerArgsMock = {
  id: "1",
  assistant: SIGNER,
  admin: SIGNER,
  treasury: SIGNER,
  authTokenId: "0",
  authTokenType: AuthTokenType.NONE,
  metadataUri: "ipfs://seller-metadata"
};

const optInToSellerUpdateArgsMock = {
  id: "1",
  fieldsToUpdate: { assistant: true }
};

const conditionStruct = {
  method: EvaluationMethod.Threshold,
  tokenType: TokenType.FungibleToken,
  tokenAddress: TOKEN,
  gatingType: GatingType.PerAddress,
  minTokenId: "0",
  maxTokenId: "0",
  threshold: "1",
  maxCommits: "1"
};

const createGroupArgsMock = {
  ...conditionStruct,
  sellerId: "1",
  offerIds: ["1"]
};

const createOfferArgsMock = mockCreateOfferArgs();

const sellerParamsMock = {
  collectionIndex: "0",
  royaltyInfo: { recipients: [AddressZero], bps: ["0"] },
  mutualizerAddress: AddressZero
};

const createOfferAndCommitArgsMock = {
  ...createOfferArgsMock,
  offerCreator: SIGNER,
  committer: SIGNER,
  condition: conditionStruct,
  useDepositedFunds: false,
  signature:
    "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b",
  sellerId: "1",
  buyerId: "1",
  sellerOfferParams: sellerParamsMock
};

// ─── 7. signMetaTxCallExternalContract ───────────────────────────────────────

describe("MetaTxMixin#signMetaTxCallExternalContract()", () => {
  const sellerFromSubgraph = mockRawSellerFromSubgraph({
    assistant: SIGNER,
    voucherCloneAddress: VOUCHER_CLONE
  });

  const mockVoucherMetaTxResult = {
    to: VOUCHER_CLONE,
    functionSignature: "0x",
    signature: "0x",
    request: { from: SIGNER, to: VOUCHER_CLONE, nonce: "0", data: "0x" },
    r: "0x",
    s: "0x",
    v: 0
  };

  test("resolves bosonVoucherAddress via subgraph getSellerByAddress", async () => {
    interceptSubgraph("getSellersQuery")
      .times(2)
      .reply(200, { data: { sellers: [sellerFromSubgraph] } });
    const spy = jest
      .spyOn(metaTxHandler, "signMetaTxCallExternalContract")
      .mockResolvedValueOnce(mockVoucherMetaTxResult);
    const sdk = makeCoreSDK();

    await sdk.signMetaTxCallExternalContract({
      to: ZERO_ADDRESS,
      data: "0x1234"
    });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        bosonVoucherAddress: VOUCHER_CLONE,
        forwarderAddress: FORWARDER
      }),
      expect.anything()
    );
    spy.mockRestore();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tier 2: pure handler-delegating overloads
// These methods have no mixin-specific logic beyond injecting web3Lib /
// metaTxHandlerAddress / chainId.  Tests verify the returnTypedDataToSign
// dispatch is wired correctly and that PROTOCOL_DIAMOND is injected.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Tier 2-A: signMetaTx (base) ─────────────────────────────────────────────

describe("MetaTxMixin#signMetaTx() overload dispatch", () => {
  const extraArgs = {
    functionName: "testFn()",
    functionSignature: "0xdeadbeef"
  };

  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTx({
      ...extraArgs,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe("testFn()");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTx as any)({
      ...extraArgs,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

// ─── Tier 2-B: seller account methods ────────────────────────────────────────

describe("MetaTxMixin#signMetaTxCreateSeller() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateSeller({
      createSellerArgs: createSellerArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createSeller");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCreateSeller as any)({
      createSellerArgs: createSellerArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxUpdateSeller() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxUpdateSeller({
      updateSellerArgs: updateSellerArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("updateSeller");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxUpdateSeller as any)({
      updateSellerArgs: updateSellerArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxOptInToSellerUpdate() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxOptInToSellerUpdate({
      optInToSellerUpdateArgs: optInToSellerUpdateArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("optInToSellerUpdate");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxOptInToSellerUpdate as any)({
      optInToSellerUpdateArgs: optInToSellerUpdateArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

// ─── Tier 2-C: offer management ──────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxCreateOffer() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateOffer({
      createOfferArgs: createOfferArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createOffer");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCreateOffer as any)({
      createOfferArgs: createOfferArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxCreateOfferBatch() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateOfferBatch({
      createOffersArgs: [createOfferArgsMock],
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createOfferBatch");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCreateOfferBatch as any)({
      createOffersArgs: [createOfferArgsMock],
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxCreateGroup() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateGroup({
      createGroupArgs: createGroupArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createGroup");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCreateGroup as any)({
      createGroupArgs: createGroupArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxCreateOfferWithCondition() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateOfferWithCondition({
      offerToCreate: createOfferArgsMock,
      condition: conditionStruct,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createOfferWithCondition");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDK().signMetaTxCreateOfferWithCondition as any
    )({
      offerToCreate: createOfferArgsMock,
      condition: conditionStruct,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe.each([
  ["signMetaTxVoidOffer", "voidOffer(uint256)", { offerId: "1", nonce: NONCE }],
  [
    "signMetaTxVoidOfferBatch",
    "voidOfferBatch(uint256[])",
    { offerIds: ["1", "2"], nonce: NONCE }
  ],
  [
    "signMetaTxExtendOffer",
    "extendOffer(uint256,uint256)",
    { offerId: "1", validUntil: VALID_UNTIL, nonce: NONCE }
  ],
  [
    "signMetaTxExtendOfferBatch",
    "extendOfferBatch(uint256[],uint256)",
    { offerIds: ["1", "2"], validUntil: VALID_UNTIL, nonce: NONCE }
  ],
  [
    "signMetaTxCompleteExchangeBatch",
    "completeExchangeBatch(uint256[])",
    { exchangeIds: ["1", "2"], nonce: NONCE }
  ]
] as const)(
  "MetaTxMixin#%s() overload dispatch",
  (methodName, expectedFunctionName, args) => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (makeCoreSDK() as any)[methodName](args);
      assertSignedMetaTx(result);
      expect(result.functionName).toBe(expectedFunctionName);
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await (makeCoreSDK() as any)[methodName]({
        ...args,
        returnTypedDataToSign: true
      });
      assertStructuredDataShape(result, "MetaTransaction");
    });
  }
);

// ─── Tier 2-D: commit methods ─────────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxCommitToConditionalOffer() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCommitToConditionalOffer({
      offerId: "1",
      tokenId: "42",
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe(
      "commitToConditionalOffer(address,uint256,uint256)"
    );
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDK().signMetaTxCommitToConditionalOffer as any
    )({
      offerId: "1",
      tokenId: "42",
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTxCommitToConditionalOffer");
  });
});

describe("MetaTxMixin#signMetaTxCommitToBuyerOffer() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCommitToBuyerOffer({
      offerId: "1",
      sellerParams: sellerParamsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("commitToBuyerOffer");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCommitToBuyerOffer as any)({
      offerId: "1",
      sellerParams: sellerParamsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

describe("MetaTxMixin#signMetaTxCreateOfferAndCommit() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxCreateOfferAndCommit({
      createOfferAndCommitArgs: createOfferAndCommitArgsMock,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toContain("createOfferAndCommit");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxCreateOfferAndCommit as any)({
      createOfferAndCommitArgs: createOfferAndCommitArgsMock,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

// ─── Tier 2-E: exchange / dispute methods (exchangeId-only) ──────────────────

describe.each([
  ["signMetaTxCancelVoucher", "cancelVoucher(uint256)", "MetaTxExchange"],
  ["signMetaTxRedeemVoucher", "redeemVoucher(uint256)", "MetaTxExchange"],
  ["signMetaTxCompleteExchange", "completeExchange(uint256)", "MetaTxExchange"],
  ["signMetaTxExpireVoucher", "expireVoucher(uint256)", "MetaTransaction"],
  ["signMetaTxRevokeVoucher", "revokeVoucher(uint256)", "MetaTransaction"],
  ["signMetaTxRetractDispute", "retractDispute(uint256)", "MetaTxExchange"],
  ["signMetaTxEscalateDispute", "escalateDispute(uint256)", "MetaTxExchange"],
  ["signMetaTxRaiseDispute", "raiseDispute(uint256)", "MetaTxExchange"]
] as const)(
  "MetaTxMixin#%s() overload dispatch",
  (methodName, expectedFunctionName, expectedPrimaryType) => {
    const args = { exchangeId: "1", nonce: NONCE };

    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (makeCoreSDK() as any)[methodName](args);
      assertSignedMetaTx(result);
      expect(result.functionName).toBe(expectedFunctionName);
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await (makeCoreSDK() as any)[methodName]({
        ...args,
        returnTypedDataToSign: true
      });
      assertStructuredDataShape(result, expectedPrimaryType);
    });
  }
);

// ─── Tier 2-F: dispute resolution ────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxResolveDispute() overload dispatch", () => {
  const COUNTERPARTY_SIG =
    "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b";

  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxResolveDispute({
      exchangeId: "1",
      buyerPercent: 10,
      counterpartySig: COUNTERPARTY_SIG,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe("resolveDispute(uint256,uint256,bytes)");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxResolveDispute as any)({
      exchangeId: "1",
      buyerPercent: 10,
      counterpartySig: COUNTERPARTY_SIG,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTxDisputeResolution");
  });
});

describe("MetaTxMixin#signMetaTxExtendDisputeTimeout() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxExtendDisputeTimeout({
      exchangeId: "1",
      newTimeout: VALID_UNTIL,
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe("extendDisputeTimeout(uint256,uint256)");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxExtendDisputeTimeout as any)({
      exchangeId: "1",
      newTimeout: VALID_UNTIL,
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});

// ─── Tier 2-G: funds ─────────────────────────────────────────────────────────

describe("MetaTxMixin#signMetaTxWithdrawFunds() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxWithdrawFunds({
      entityId: "1",
      tokenList: [TOKEN],
      tokenAmounts: ["1000000000000000000"],
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe(
      "withdrawFunds(uint256,address[],uint256[])"
    );
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxWithdrawFunds as any)({
      entityId: "1",
      tokenList: [TOKEN],
      tokenAmounts: ["1000000000000000000"],
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTxFund");
  });
});

describe("MetaTxMixin#signMetaTxDepositFunds() overload dispatch", () => {
  test("returns SignedMetaTx without returnTypedDataToSign", async () => {
    const result = await makeCoreSDK().signMetaTxDepositFunds({
      entityId: "1",
      fundsTokenAddress: TOKEN,
      fundsAmount: "1000000000000000000",
      nonce: NONCE
    });
    assertSignedMetaTx(result);
    expect(result.functionName).toBe("depositFunds(uint256,address,uint256)");
  });

  test("returns StructuredData with returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (makeCoreSDK().signMetaTxDepositFunds as any)({
      entityId: "1",
      fundsTokenAddress: TOKEN,
      fundsAmount: "1000000000000000000",
      nonce: NONCE,
      returnTypedDataToSign: true
    });
    assertStructuredDataShape(result, "MetaTransaction");
  });
});
