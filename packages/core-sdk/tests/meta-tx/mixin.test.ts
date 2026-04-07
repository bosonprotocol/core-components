import { AuthTokenType, abis } from "@bosonprotocol/common";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
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
      .mockImplementation(async () => (relayCount++ === 0 ? mockUpdateTx : mockOptInTx));

    jest.spyOn(sdk, "signMetaTxUpdateSeller").mockResolvedValue({
      functionName: "updateSeller((uint256,address,address,address,address,uint256,uint8))",
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
    jest
      .spyOn(sdkAny, "getSellerById")
      .mockResolvedValue(
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
    jest
      .spyOn(sdkAny, "getSellerById")
      .mockResolvedValue(
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

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ batchId: 7 })
    );
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
      .mockResolvedValueOnce({ ...mockVoucherMetaTxResult, to: EXPLICIT_VOUCHER });
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
