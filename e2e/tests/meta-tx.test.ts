import { Wallet, BigNumber } from "ethers";

import { OfferFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";

import {
  initCoreSDKWithWallet,
  MOCK_ERC20_ADDRESS,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  seedWallet7,
  seedWallet8,
  waitForGraphNodeIndexing,
  metadata,
  defaultConfig,
  createOffer
} from "./utils";

const sellerWallet = seedWallet7; // be sure the seedWallet is not used by another test (to allow concurrent run)
const sellerAddress = sellerWallet.address;
const buyerWallet = seedWallet8; // be sure the seedWallet is not used by another test (to allow concurrent run)
// seedWallet9 is used to relay meta-transactions

const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
const buyerCoreSDK = initCoreSDKWithWallet(buyerWallet);

jest.setTimeout(60_000);

describe("meta-tx", () => {
  let offer: OfferFieldsFragment;

  beforeAll(async () => {
    await ensureCreatedSeller(sellerWallet);
    await ensureMintedAndAllowedTokens([sellerWallet, buyerWallet]);
    const createdOfferId = await createOfferAndDepositFunds(sellerWallet);
    await waitForGraphNodeIndexing();
    offer = await sellerCoreSDK.getOfferById(createdOfferId);
  });

  // TODO: Find a way to make this work. This fails with `processing error: unknown account` because
  // the ephemeral account is not a known signer of the hardhat node.
  describe.skip("#signMetaTxCreateSeller()", () => {
    test("create for random wallet", async () => {
      const nonce = Date.now();
      const randomWallet = Wallet.createRandom();
      const randomSellerCoreSDK = initCoreSDKWithWallet(randomWallet);

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await randomSellerCoreSDK.signMetaTxCreateSeller({
          createSellerArgs: {
            operator: randomWallet.address,
            treasury: randomWallet.address,
            admin: randomWallet.address,
            clerk: randomWallet.address,
            // TODO: replace with correct uri
            contractUri: "ipfs://seller-contract",
            royaltyPercentage: "0",
            authTokenId: "0",
            authTokenType: 0
          },
          nonce,
          chainId: defaultConfig.chainId
        });

      // `Relayer` executes meta tx on behalf of random seller
      const metaTx = await randomSellerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });

      const metaTxReceipt = await metaTx.wait();
      const metaTxEvent = metaTxReceipt.events?.find(
        (event) => event.event === "MetaTransactionExecuted"
      );

      expect(metaTxEvent).toBeTruthy();
    });
  });

  describe("#signMetaTxCreateOffer()", () => {
    test("create an offer", async () => {
      const metadataHash = await sellerCoreSDK.storeMetadata({
        ...metadata,
        type: "BASE"
      });
      const metadataUri = "ipfs://" + metadataHash;

      const createOfferArgs = mockCreateOfferArgs({
        metadataHash,
        metadataUri
      });

      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxCreateOffer({
          createOfferArgs,
          nonce,
          chainId: defaultConfig.chainId
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxCreateOfferBatch()", () => {
    test("create batch of offers", async () => {
      const metadataHash = await sellerCoreSDK.storeMetadata({
        ...metadata,
        type: "BASE"
      });
      const metadataUri = "ipfs://" + metadataHash;

      const createOfferArgs = mockCreateOfferArgs({
        metadataHash,
        metadataUri
      });

      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxCreateOfferBatch({
          createOffersArgs: [createOfferArgs, createOfferArgs],
          nonce,
          chainId: defaultConfig.chainId
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxVoidOffer()", () => {
    test("void created offer", async () => {
      const createdOffer = await createOffer(sellerCoreSDK);

      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxVoidOffer({
          offerId: createdOffer.id,
          nonce,
          chainId: defaultConfig.chainId
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxVoidOfferBatch()", () => {
    test("void created offers", async () => {
      const createdOffer1 = await createOffer(sellerCoreSDK);
      const createdOffer2 = await createOffer(sellerCoreSDK);

      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxVoidOfferBatch({
          offerIds: [createdOffer1.id, createdOffer2.id],
          nonce,
          chainId: defaultConfig.chainId
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxCommitToOffer()", () => {
    test("non-native exchange token offer", async () => {
      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxCommitToOffer({
          offerId: offer.id,
          nonce
        });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await buyerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });
      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxRedeemVoucher()", () => {
    test("non-native exchange token offer", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offer.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxRedeemVoucher({
          exchangeId: Number(exchangeId),
          nonce
        });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await buyerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });
      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });

  describe("#signMetaTxCancelVoucher()", () => {
    test("non-native exchange token offer", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offer.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxCancelVoucher({
          exchangeId: exchangeId as string,
          nonce
        });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await buyerCoreSDK.relayMetaTransaction({
        functionName,
        functionSignature,
        nonce,
        sigR: r,
        sigS: s,
        sigV: v
      });
      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });
});

async function createOfferAndDepositFunds(sellerWallet: Wallet) {
  const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
  const seller = await sellerCoreSDK.getSellerByAddress(sellerAddress);
  // Store metadata
  const metadataHash = await sellerCoreSDK.storeMetadata({
    ...metadata,
    type: "BASE"
  });
  const metadataUri = "ipfs://" + metadataHash;

  // Create offer
  const offerArgs = mockCreateOfferArgs({
    metadataHash,
    metadataUri,
    exchangeToken: MOCK_ERC20_ADDRESS
  });
  const createOfferTx = await sellerCoreSDK.createOffer(offerArgs);
  const createOfferReceipt = await createOfferTx.wait();
  const offerId = sellerCoreSDK.getCreatedOfferIdFromLogs(
    createOfferReceipt.logs
  );

  // Deposit funds
  const depositFundsTx = await sellerCoreSDK.depositFunds(
    seller.id,
    BigNumber.from(offerArgs.quantityAvailable).mul(offerArgs.sellerDeposit),
    MOCK_ERC20_ADDRESS
  );
  await depositFundsTx.wait();

  return offerId as string;
}
