import { Wallet, BigNumber } from "ethers";

import { OfferFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { contracts } from "../../packages/ethers-sdk/src";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";

import {
  initCoreSDKWithWallet,
  MOCK_ERC20_ADDRESS,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  seedWallet1,
  seedWallet2,
  seedWallet3,
  defaultConfig,
  waitForGraphNodeIndexing,
  metadata
} from "./utils";

const relayerWallet = seedWallet1;
const sellerWallet = seedWallet2;
const sellerAddress = sellerWallet.address;
const buyerWallet = seedWallet3;

// Contract is connected to `relayerWallet` because this wallet pays the gas fees
const metaTxHandlerContract =
  contracts.IBosonMetaTransactionsHandler__factory.connect(
    defaultConfig.contracts.protocolDiamond,
    relayerWallet
  );

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
      const { r, s, v } = await buyerCoreSDK.signExecuteMetaTxCommitToOffer({
        offerId: offer.id,
        nonce,
        chainId: defaultConfig.chainId
      });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await metaTxHandlerContract.executeMetaTxCommitToOffer(
        buyerWallet.address,
        {
          buyer: buyerWallet.address,
          offerId: offer.id
        },
        nonce,
        r,
        s,
        v
      );
      const metaTxReceipt = await metaTx.wait();
      const metaTxEvent = metaTxReceipt.events?.find(
        (event) => event.event === "MetaTransactionExecuted"
      );

      expect(metaTxEvent).toBeTruthy();
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
      const { r, s, v } = await buyerCoreSDK.signExecuteMetaTxRedeemVoucher({
        exchangeId: Number(exchangeId),
        nonce,
        chainId: defaultConfig.chainId
      });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await metaTxHandlerContract.executeMetaTxRedeemVoucher(
        buyerWallet.address,
        {
          exchangeId: exchangeId as string
        },
        nonce,
        r,
        s,
        v
      );
      const metaTxReceipt = await metaTx.wait();
      const metaTxEvent = metaTxReceipt.events?.find(
        (event) => event.event === "MetaTransactionExecuted"
      );

      expect(metaTxEvent).toBeTruthy();
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
      const { r, s, v } = await buyerCoreSDK.signExecuteMetaTxCancelVoucher({
        exchangeId: exchangeId as string,
        nonce,
        chainId: defaultConfig.chainId
      });

      // `Relayer` executes meta tx on behalf of `Buyer`
      const metaTx = await metaTxHandlerContract.executeMetaTxCancelVoucher(
        buyerWallet.address,
        {
          exchangeId: exchangeId as string
        },
        nonce,
        r,
        s,
        v
      );
      const metaTxReceipt = await metaTx.wait();
      const metaTxEvent = metaTxReceipt.events?.find(
        (event) => event.event === "MetaTransactionExecuted"
      );

      expect(metaTxEvent).toBeTruthy();
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
