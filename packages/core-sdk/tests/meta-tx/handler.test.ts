import {
  MockWeb3LibAdapter,
  mockCreateOfferArgs
} from "@bosonprotocol/common/tests/mocks";
import {
  signMetaTx,
  signMetaTxCreateSeller,
  signMetaTxUpdateSeller,
  signMetaTxOptInToSellerUpdate,
  signMetaTxCreateOffer,
  signMetaTxCreateOfferBatch,
  signMetaTxVoidOffer,
  signMetaTxVoidOfferBatch,
  signMetaTxExtendOffer,
  signMetaTxExtendOfferBatch,
  signMetaTxCompleteExchangeBatch,
  signMetaTxExpireVoucher,
  signMetaTxRevokeVoucher,
  signMetaTxCreateGroup,
  signMetaTxReserveRange,
  signMetaTxPreMint,
  signMetaTxSetApprovalForAll,
  signMetaTxCreateOfferWithCondition,
  signMetaTxCommitToOffer,
  signMetaTxCommitToConditionalOffer,
  signMetaTxCommitToBuyerOffer,
  signMetaTxCreateOfferAndCommit,
  signMetaTxCancelVoucher,
  signMetaTxRedeemVoucher,
  signMetaTxCompleteExchange,
  signMetaTxRetractDispute,
  signMetaTxEscalateDispute,
  signMetaTxRaiseDispute,
  signMetaTxResolveDispute,
  signMetaTxExtendDisputeTimeout,
  signMetaTxWithdrawFunds,
  signMetaTxDepositFunds,
  getResubmitted
} from "../../src/meta-tx/handler";
import * as mockInterface from "../../src/forwarder/mock-interface";
import { UnsignedMetaTx } from "../../src/meta-tx/handler";
import nock from "nock";
import { AddressZero } from "@ethersproject/constants";
import {
  AuthTokenType,
  EvaluationMethod,
  GatingType,
  TokenType
} from "@bosonprotocol/common";

jest.setTimeout(60_000);

// ─── Shared constants ────────────────────────────────────────────────────────

const CHAIN_ID = 31337; // local chain → avoids Biconomy paths
const META_TX_HANDLER = "0x0000000000000000000000000000000000000000";
const SIGNER = "0x0000000000000000000000000000000000000001";
const TOKEN = "0x0000000000000000000000000000000000000002";
// A real-looking signature produced by the mock adapter
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";
const EXPECTED_R =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd";
const EXPECTED_S =
  "0x72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a";
const EXPECTED_V = 27;
const NONCE = 1;
// ABI-encoded `true` (bool) – returned by isSellerSaltAvailable mock
const ABI_BOOL_TRUE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeWeb3Lib() {
  return new MockWeb3LibAdapter({
    getSignerAddress: SIGNER,
    send: MOCK_SIG,
    call: ABI_BOOL_TRUE
  });
}

function base() {
  return {
    chainId: CHAIN_ID,
    metaTxHandlerAddress: META_TX_HANDLER,
    nonce: NONCE,
    web3Lib: makeWeb3Lib()
  };
}

function assertSignedMetaTx(result: unknown) {
  const r = result as {
    r: string;
    s: string;
    v: number;
    functionName: string;
    functionSignature: string;
  };
  expect(r.r).toBe(EXPECTED_R);
  expect(r.s).toBe(EXPECTED_S);
  expect(r.v).toBe(EXPECTED_V);
  expect(typeof r.functionName).toBe("string");
  expect(typeof r.functionSignature).toBe("string");
}

function assertStructuredData(result: unknown, expectedPrimaryType: string) {
  const d = result as UnsignedMetaTx;
  expect(d.primaryType).toBe(expectedPrimaryType);
  expect(d.domain.name).toBe("Boson Protocol");
  expect(d.domain.verifyingContract).toBe(META_TX_HANDLER);
  expect(Array.isArray(d.types.EIP712Domain)).toBe(true);
  expect(typeof d.message).toBe("object");
  // Confirm it is NOT a SignedMetaTx
  expect((d as unknown as { r?: unknown }).r).toBeUndefined();
  // Confirm UnsignedMetaTx fields are present
  expect(typeof d.functionName).toBe("string");
  expect(typeof d.functionSignature).toBe("string");
}

// ─── Shared arg fixtures ─────────────────────────────────────────────────────

const createSellerArgs = {
  assistant: SIGNER,
  admin: SIGNER,
  treasury: SIGNER,
  contractUri: "ipfs://contract-uri",
  royaltyPercentage: "0",
  authTokenId: "0",
  authTokenType: AuthTokenType.NONE,
  metadataUri: "ipfs://seller-metadata"
};

const updateSellerArgs = {
  id: "1",
  assistant: SIGNER,
  admin: SIGNER,
  treasury: SIGNER,
  authTokenId: "0",
  authTokenType: AuthTokenType.NONE,
  metadataUri: "ipfs://seller-metadata"
};

const optInToSellerUpdateArgs = {
  id: "1",
  fieldsToUpdate: { assistant: true }
};

const createOfferArgsMock = mockCreateOfferArgs();

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

const createGroupArgs = {
  ...conditionStruct,
  sellerId: "1",
  offerIds: ["1"]
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("meta-tx handler", () => {
  // ── signMetaTx (base) ──────────────────────────────────────────────────────
  describe("#signMetaTx()", () => {
    const extraArgs = {
      functionName: "testFn()",
      functionSignature: "0xdeadbeef"
    };

    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTx({ ...base(), ...extraArgs });
      assertSignedMetaTx(result);
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTx({
        ...base(),
        ...extraArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: extraArgs.functionName,
        from: SIGNER
      });
    });
  });

  // ── signMetaTxCreateSeller ─────────────────────────────────────────────────
  describe("#signMetaTxCreateSeller()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateSeller({
        ...base(),
        createSellerArgs
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createSeller");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateSeller({
        ...base(),
        createSellerArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxUpdateSeller ─────────────────────────────────────────────────
  describe("#signMetaTxUpdateSeller()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxUpdateSeller({
        ...base(),
        updateSellerArgs
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("updateSeller");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxUpdateSeller({
        ...base(),
        updateSellerArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxOptInToSellerUpdate ──────────────────────────────────────────
  describe("#signMetaTxOptInToSellerUpdate()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxOptInToSellerUpdate({
        ...base(),
        optInToSellerUpdateArgs
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("optInToSellerUpdate");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxOptInToSellerUpdate({
        ...base(),
        optInToSellerUpdateArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCreateOffer ──────────────────────────────────────────────────
  describe("#signMetaTxCreateOffer()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateOffer({
        ...base(),
        createOfferArgs: createOfferArgsMock
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createOffer");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateOffer({
        ...base(),
        createOfferArgs: createOfferArgsMock,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCreateOfferBatch ─────────────────────────────────────────────
  describe("#signMetaTxCreateOfferBatch()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateOfferBatch({
        ...base(),
        createOffersArgs: [createOfferArgsMock]
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createOfferBatch");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateOfferBatch({
        ...base(),
        createOffersArgs: [createOfferArgsMock],
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxVoidOffer ────────────────────────────────────────────────────
  describe("#signMetaTxVoidOffer()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxVoidOffer({ ...base(), offerId: "1" });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("voidOffer(uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxVoidOffer({
        ...base(),
        offerId: "1",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxVoidOfferBatch ───────────────────────────────────────────────
  describe("#signMetaTxVoidOfferBatch()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxVoidOfferBatch({
        ...base(),
        offerIds: ["1", "2"]
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("voidOfferBatch(uint256[])");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxVoidOfferBatch({
        ...base(),
        offerIds: ["1", "2"],
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxExtendOffer ──────────────────────────────────────────────────
  describe("#signMetaTxExtendOffer()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxExtendOffer({
        ...base(),
        offerId: "1",
        validUntil: Math.floor(Date.now() / 1000) + 3600
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("extendOffer(uint256,uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxExtendOffer({
        ...base(),
        offerId: "1",
        validUntil: Math.floor(Date.now() / 1000) + 3600,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxExtendOfferBatch ─────────────────────────────────────────────
  describe("#signMetaTxExtendOfferBatch()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxExtendOfferBatch({
        ...base(),
        offerIds: ["1", "2"],
        validUntil: Math.floor(Date.now() / 1000) + 3600
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("extendOfferBatch(uint256[],uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxExtendOfferBatch({
        ...base(),
        offerIds: ["1", "2"],
        validUntil: Math.floor(Date.now() / 1000) + 3600,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCompleteExchangeBatch ────────────────────────────────────────
  describe("#signMetaTxCompleteExchangeBatch()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCompleteExchangeBatch({
        ...base(),
        exchangeIds: ["1", "2"]
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("completeExchangeBatch(uint256[])");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCompleteExchangeBatch({
        ...base(),
        exchangeIds: ["1", "2"],
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxExpireVoucher ────────────────────────────────────────────────
  describe("#signMetaTxExpireVoucher()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxExpireVoucher({
        ...base(),
        exchangeId: "1"
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("expireVoucher(uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxExpireVoucher({
        ...base(),
        exchangeId: "1",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxRevokeVoucher ────────────────────────────────────────────────
  describe("#signMetaTxRevokeVoucher()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxRevokeVoucher({
        ...base(),
        exchangeId: "1"
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("revokeVoucher(uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxRevokeVoucher({
        ...base(),
        exchangeId: "1",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCreateGroup ──────────────────────────────────────────────────
  describe("#signMetaTxCreateGroup()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateGroup({
        ...base(),
        createGroupArgs
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createGroup");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateGroup({
        ...base(),
        createGroupArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxReserveRange ─────────────────────────────────────────────────
  describe("#signMetaTxReserveRange()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxReserveRange({
        ...base(),
        offerId: "1",
        length: "100",
        to: SIGNER
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("reserveRange(uint256,uint256,address)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxReserveRange({
        ...base(),
        offerId: "1",
        length: "100",
        to: SIGNER,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCreateOfferWithCondition ─────────────────────────────────────
  describe("#signMetaTxCreateOfferWithCondition()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateOfferWithCondition({
        ...base(),
        offerToCreate: createOfferArgsMock,
        condition: conditionStruct
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createOfferWithCondition");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateOfferWithCondition({
        ...base(),
        offerToCreate: createOfferArgsMock,
        condition: conditionStruct,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCommitToOffer ────────────────────────────────────────────────
  describe("#signMetaTxCommitToOffer()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCommitToOffer({ ...base(), offerId: "1" });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("commitToOffer(address,uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCommitToOffer({
        ...base(),
        offerId: "1",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTxCommitToOffer");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: "commitToOffer(address,uint256)"
      });
    });
  });

  // ── signMetaTxCommitToConditionalOffer ─────────────────────────────────────
  describe("#signMetaTxCommitToConditionalOffer()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCommitToConditionalOffer({
        ...base(),
        offerId: "1",
        tokenId: "42"
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe(
        "commitToConditionalOffer(address,uint256,uint256)"
      );
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCommitToConditionalOffer({
        ...base(),
        offerId: "1",
        tokenId: "42",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTxCommitToConditionalOffer");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: "commitToConditionalOffer(address,uint256,uint256)"
      });
    });
  });

  // ── signMetaTxCommitToBuyerOffer ───────────────────────────────────────────
  describe("#signMetaTxCommitToBuyerOffer()", () => {
    const sellerParams = {
      collectionIndex: "0",
      royaltyInfo: { recipients: [AddressZero], bps: ["0"] },
      mutualizerAddress: AddressZero
    };

    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCommitToBuyerOffer({
        ...base(),
        offerId: "1",
        sellerParams
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("commitToBuyerOffer");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCommitToBuyerOffer({
        ...base(),
        offerId: "1",
        sellerParams,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxCreateOfferAndCommit ─────────────────────────────────────────
  describe("#signMetaTxCreateOfferAndCommit()", () => {
    const createOfferAndCommitArgs = {
      ...createOfferArgsMock,
      offerCreator: SIGNER,
      committer: SIGNER,
      condition: conditionStruct,
      useDepositedFunds: false,
      signature: MOCK_SIG,
      sellerId: "1",
      buyerId: "1",
      sellerOfferParams: {
        collectionIndex: "0",
        royaltyInfo: { recipients: [AddressZero], bps: ["0"] },
        mutualizerAddress: AddressZero
      }
    };

    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxCreateOfferAndCommit({
        ...base(),
        createOfferAndCommitArgs
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toContain("createOfferAndCommit");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxCreateOfferAndCommit({
        ...base(),
        createOfferAndCommitArgs,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── Exchange meta-tx functions (via makeExchangeMetaTxSigner) ──────────────
  describe.each([
    [
      "#signMetaTxCancelVoucher()",
      signMetaTxCancelVoucher,
      "cancelVoucher(uint256)"
    ],
    [
      "#signMetaTxRedeemVoucher()",
      signMetaTxRedeemVoucher,
      "redeemVoucher(uint256)"
    ],
    [
      "#signMetaTxCompleteExchange()",
      signMetaTxCompleteExchange,
      "completeExchange(uint256)"
    ],
    [
      "#signMetaTxRetractDispute()",
      signMetaTxRetractDispute,
      "retractDispute(uint256)"
    ],
    [
      "#signMetaTxEscalateDispute()",
      signMetaTxEscalateDispute,
      "escalateDispute(uint256)"
    ],
    [
      "#signMetaTxRaiseDispute()",
      signMetaTxRaiseDispute,
      "raiseDispute(uint256)"
    ]
  ] as const)("%s", (_name, fn, expectedFunctionName) => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await fn({ ...base(), exchangeId: "1" });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe(expectedFunctionName);
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await fn({
        ...base(),
        exchangeId: "1",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTxExchange");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: expectedFunctionName
      });
    });
  });

  // ── signMetaTxResolveDispute ───────────────────────────────────────────────
  describe("#signMetaTxResolveDispute()", () => {
    const counterpartySig = {
      signature:
        "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b",
      r: "0xd093bf19f8e5d7526953f63b7721628b95820e94cf42298f97cd4502b61ff392",
      s: "0x024b4030ee7db3f74690e721289b287583d72ccd8ad297e69c822eb4f1f87c2a1b",
      v: 27
    };

    test("call with string format signature", async () => {
      const signedMetaTx = await signMetaTxResolveDispute({
        ...base(),
        exchangeId: 1,
        buyerPercent: 10,
        counterpartySig: counterpartySig.signature
      });
      expect(signedMetaTx.r).toEqual(EXPECTED_R);
      expect(signedMetaTx.s).toEqual(EXPECTED_S);
      expect(signedMetaTx.v).toEqual(EXPECTED_V);
    });

    test("call with {r,s,v} format signature", async () => {
      const signedMetaTx = await signMetaTxResolveDispute({
        ...base(),
        exchangeId: 1,
        buyerPercent: 10,
        counterpartySig: {
          r: counterpartySig.r,
          s: counterpartySig.s,
          v: counterpartySig.v
        }
      });
      expect(signedMetaTx.r).toEqual(EXPECTED_R);
      expect(signedMetaTx.s).toEqual(EXPECTED_S);
      expect(signedMetaTx.v).toEqual(EXPECTED_V);
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxResolveDispute({
        ...base(),
        exchangeId: 1,
        buyerPercent: 10,
        counterpartySig: counterpartySig.signature,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTxDisputeResolution");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: "resolveDispute(uint256,uint256,bytes)"
      });
    });
  });

  // ── signMetaTxExtendDisputeTimeout ─────────────────────────────────────────
  describe("#signMetaTxExtendDisputeTimeout()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxExtendDisputeTimeout({
        ...base(),
        exchangeId: "1",
        newTimeout: Math.floor(Date.now() / 1000) + 86400
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("extendDisputeTimeout(uint256,uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxExtendDisputeTimeout({
        ...base(),
        exchangeId: "1",
        newTimeout: Math.floor(Date.now() / 1000) + 86400,
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── signMetaTxWithdrawFunds ────────────────────────────────────────────────
  describe("#signMetaTxWithdrawFunds()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxWithdrawFunds({
        ...base(),
        entityId: "1",
        tokenList: [TOKEN],
        tokenAmounts: ["1000000000000000000"]
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe(
        "withdrawFunds(uint256,address[],uint256[])"
      );
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxWithdrawFunds({
        ...base(),
        entityId: "1",
        tokenList: [TOKEN],
        tokenAmounts: ["1000000000000000000"],
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTxFund");
      expect((result as UnsignedMetaTx).message).toMatchObject({
        functionName: "withdrawFunds(uint256,address[],uint256[])"
      });
    });
  });

  // ── signMetaTxDepositFunds ─────────────────────────────────────────────────
  describe("#signMetaTxDepositFunds()", () => {
    test("returns SignedMetaTx without returnTypedDataToSign", async () => {
      const result = await signMetaTxDepositFunds({
        ...base(),
        entityId: "1",
        fundsTokenAddress: TOKEN,
        fundsAmount: "1000000000000000000"
      });
      assertSignedMetaTx(result);
      expect(result.functionName).toBe("depositFunds(uint256,address,uint256)");
    });

    test("returns StructuredData with returnTypedDataToSign: true", async () => {
      const result = await signMetaTxDepositFunds({
        ...base(),
        entityId: "1",
        fundsTokenAddress: TOKEN,
        fundsAmount: "1000000000000000000",
        returnTypedDataToSign: true
      });
      assertStructuredData(result, "MetaTransaction");
    });
  });

  // ── Voucher meta-tx (no returnTypedDataToSign – unchanged) ─────────────────
  describe("#signMetaTxPreMint()", () => {
    const biconomyUrl = "https://api.biconomy.io";
    const expectedSig =
      "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";

    test("call signMetaTxPreMint (Biconomy path)", async () => {
      nock(biconomyUrl)
        .get("/api/v2/meta-tx/systemInfo?networkId=1")
        .reply(200, {
          code: 200,
          message: "OK",
          forwarderDomainDetails: {
            key1: {
              verifyingContract: "0x0000000000000000000000000000000000000000",
              name: "Biconomy Forwarder",
              version: "1",
              salt: "0x0000000000000000000000000000000000000000000000000000000000000001"
            }
          }
        });

      const signedMetaTx = await signMetaTxPreMint({
        chainId: 1, // non-local → Biconomy path
        bosonVoucherAddress: "0x0000000000000000000000000000000000000000",
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: SIGNER,
          send: expectedSig,
          getChainId: 1,
          call: "0x0000000000000000000000000000000000000000000000000000000000000042"
        }),
        offerId: 1,
        amount: 1,
        relayerUrl: biconomyUrl,
        forwarderAbi: mockInterface.abi
      });
      expect(signedMetaTx.r).toEqual(EXPECTED_R);
      expect(signedMetaTx.s).toEqual(EXPECTED_S);
      expect(signedMetaTx.v).toEqual(EXPECTED_V);
    });
  });

  describe("#signMetaTxSetApprovalForAll()", () => {
    const biconomyUrl = "https://api.biconomy.io";
    const expectedSig =
      "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";

    test("call signMetaTxSetApprovalForAll() (Biconomy path)", async () => {
      nock(biconomyUrl)
        .get("/api/v2/meta-tx/systemInfo?networkId=1")
        .reply(200, {
          code: 200,
          message: "OK",
          forwarderDomainDetails: {
            key1: {
              verifyingContract: "0x0000000000000000000000000000000000000000",
              name: "Biconomy Forwarder",
              version: "1",
              salt: "0x0000000000000000000000000000000000000000000000000000000000000001"
            }
          }
        });

      const signedMetaTx = await signMetaTxSetApprovalForAll({
        chainId: 1, // non-local → Biconomy path
        bosonVoucherAddress: "0x0000000000000000000000000000000000000000",
        web3Lib: new MockWeb3LibAdapter({
          getSignerAddress: SIGNER,
          send: expectedSig,
          getChainId: 1,
          call: "0x0000000000000000000000000000000000000000000000000000000000000042"
        }),
        operator: SIGNER,
        approved: true,
        relayerUrl: biconomyUrl,
        forwarderAbi: mockInterface.abi
      });
      expect(signedMetaTx.r).toEqual(EXPECTED_R);
      expect(signedMetaTx.s).toEqual(EXPECTED_S);
      expect(signedMetaTx.v).toEqual(EXPECTED_V);
    });
  });

  // ── getResubmitted ─────────────────────────────────────────────────────────
  test("getResubmitted", async () => {
    const biconomyUrl = "https://api.biconomy.io";
    nock(biconomyUrl)
      .get("/api/v1/meta-tx/resubmitted?networkId=1&transactionHash=0x1234")
      .reply(200, {
        code: 200,
        message: "OK",
        data: { key1: "value1" }
      });
    const data = await getResubmitted({
      chainId: 1,
      metaTx: {
        config: {
          relayerUrl: biconomyUrl,
          apiId: "1234",
          apiKey: "abcd"
        },
        originalHash: "0x1234"
      }
    });
    expect(data).toEqual({ key1: "value1" });
  });
});
