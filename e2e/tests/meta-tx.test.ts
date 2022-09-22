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
  metadata
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

  describe("#signExecuteMetaTxCommitToOffer()", () => {
    test("non-native exchange token offer", async () => {
      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signExecuteMetaTxCommitToOffer({
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

  describe("#signExecuteMetaTxRedeemVoucher()", () => {
    test("non-native exchange token offer", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offer.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signExecuteMetaTxRedeemVoucher({
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

  describe("#signExecuteMetaTxCancelVoucher()", () => {
    test("non-native exchange token offer", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offer.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signExecuteMetaTxCancelVoucher({
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
