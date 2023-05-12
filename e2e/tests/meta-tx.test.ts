import { ZERO_ADDRESS } from "./../../packages/core-sdk/tests/mocks";
import { BigNumberish } from "@ethersproject/bignumber";
import { Wallet, BigNumber, constants } from "ethers";
import { OfferFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { encodeValidate } from "../../packages/core-sdk/src/seaport/handler";

import {
  initCoreSDKWithWallet,
  MOCK_ERC20_ADDRESS,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  seedWallet7,
  seedWallet8,
  waitForGraphNodeIndexing,
  metadata,
  createOffer,
  seedWallet11,
  ensureMintedERC1155,
  MOCK_ERC1155_ADDRESS,
  initCoreSDKWithFundedWallet,
  seedWallet13,
  createSeaportOrder,
  MOCK_SEAPORT_ADDRESS,
  createSeller,
  updateSellerMetaTx,
  getSellerMetadataUri
} from "./utils";
import { CoreSDK } from "../../packages/core-sdk/src";
import EvaluationMethod from "../../contracts/protocol-contracts/scripts/domain/EvaluationMethod";
import TokenType from "../../contracts/protocol-contracts/scripts/domain/TokenType";
import { AuthTokenType } from "@bosonprotocol/common";

const sellerWallet = seedWallet7; // be sure the seedWallet is not used by another test (to allow concurrent run)
const sellerAddress = sellerWallet.address;
const buyerWallet = seedWallet8; // be sure the seedWallet is not used by another test (to allow concurrent run)
const newSellerWallet = seedWallet11;
// seedWallet9 is used to relay meta-transactions

const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
const buyerCoreSDK = initCoreSDKWithWallet(buyerWallet);

jest.setTimeout(60_000);

describe("meta-tx", () => {
  let offerToCommit: OfferFieldsFragment;

  beforeAll(async () => {
    await ensureCreatedSeller(sellerWallet);
    await ensureMintedAndAllowedTokens([sellerWallet]);
    // do not approve for buyer (we expect commit to do it when needed)
    await ensureMintedAndAllowedTokens([buyerWallet], undefined, false);
    const createdOfferId = await createOfferAndDepositFunds(sellerWallet);
    await waitForGraphNodeIndexing();
    offerToCommit = await sellerCoreSDK.getOfferById(createdOfferId);
  });

  describe("#signMetaTxCreateSeller()", () => {
    test("create a new seller", async () => {
      const nonce = Date.now();
      const newSellerCoreSDK = initCoreSDKWithWallet(newSellerWallet);

      const [existingSeller] = await newSellerCoreSDK.getSellersByAddress(
        newSellerWallet.address
      );

      if (existingSeller) {
        // Change all addresses used by the seller to be able to create another one with the original address
        // Useful when repeating the test suite on the same contracts
        const { coreSDK: randomSellerCoreSDK, fundedWallet: randomWallet } =
          await initCoreSDKWithFundedWallet(sellerWallet);
        const metadataUri = await getSellerMetadataUri(randomSellerCoreSDK);
        const updateTx = await newSellerCoreSDK.updateSeller({
          id: existingSeller.id,
          admin: randomWallet.address,
          assistant: randomWallet.address,
          clerk: randomWallet.address,
          treasury: randomWallet.address,
          authTokenId: "0",
          authTokenType: 0,
          metadataUri
        });
        await updateTx.wait();
        const optinTx = await randomSellerCoreSDK.optInToSellerUpdate({
          id: existingSeller.id,
          fieldsToUpdate: {
            admin: true,
            assistant: true,
            clerk: true,
            authToken: true
          }
        });
        await optinTx.wait();
      }
      const metadataUri = await getSellerMetadataUri(newSellerCoreSDK);

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxCreateSeller({
          createSellerArgs: {
            assistant: newSellerWallet.address,
            treasury: newSellerWallet.address,
            admin: newSellerWallet.address,
            clerk: newSellerWallet.address,
            // TODO: replace with correct uri
            contractUri: "ipfs://seller-contract",
            royaltyPercentage: "0",
            authTokenId: "0",
            authTokenType: 0,
            metadataUri
          },
          nonce
        });

      // `Relayer` executes meta tx on behalf of random seller
      const metaTx = await newSellerCoreSDK.relayMetaTransaction({
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

  describe("#signMetaTxUpdateSeller()", () => {
    test("update seller", async () => {
      const nonce = Date.now();
      const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
      const [seller] = await sellerCoreSDK.getSellersByAddress(
        sellerWallet.address
      );
      expect(seller).toBeTruthy();

      const randomWallet = Wallet.createRandom();
      const metadataUri = await getSellerMetadataUri(sellerCoreSDK);

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxUpdateSeller({
          updateSellerArgs: {
            id: seller.id,
            assistant: randomWallet.address,
            treasury: randomWallet.address,
            admin: randomWallet.address,
            clerk: randomWallet.address,
            authTokenId: "0",
            authTokenType: 0,
            metadataUri
          },
          nonce
        });

      // `Relayer` executes meta tx on behalf of random seller
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

      await waitForGraphNodeIndexing();
      const existingSeller = await sellerCoreSDK.getSellerById(seller.id);
      expect(existingSeller.pendingSeller?.admin).toBe(
        randomWallet.address.toLowerCase()
      );
    });
  });

  describe("#signMetaTxUpdateSellerAndOptIn", () => {
    test("update seller - replace all addresses", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        sellerWallet
      );

      let seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const { coreSDK: coreSDK2, fundedWallet: randomWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const metadataUri = await getSellerMetadataUri(coreSDK2);

      seller = await updateSellerMetaTx(
        coreSDK,
        seller,
        {
          admin: randomWallet.address,
          assistant: randomWallet.address,
          clerk: randomWallet.address,
          treasury: randomWallet.address,
          metadataUri
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              admin: true,
              assistant: true,
              clerk: true
            }
          }
        ]
      );
      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(randomWallet.address.toLowerCase());
      expect(seller.admin).toEqual(randomWallet.address.toLowerCase());
      expect(seller.treasury).toEqual(randomWallet.address.toLowerCase());
      expect(BigNumber.from(seller.authTokenId).eq(0)).toBe(true);
      expect(seller.authTokenType).toEqual(AuthTokenType.NONE);
      expect(seller.metadataUri).toEqual(metadataUri);
    });
  });

  describe("#signMetaTxOptInToSellerUpdate()", () => {
    test("optInToSellerUpdate", async () => {
      const { coreSDK: seller1CoreSDK, fundedWallet: sellerWallet1 } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      await ensureCreatedSeller(sellerWallet1);
      const [seller1] = await seller1CoreSDK.getSellersByAddress(
        sellerWallet1.address
      );
      let nonce = Date.now();
      const randomWallet = Wallet.createRandom();
      const randomCoreSDK = initCoreSDKWithWallet(randomWallet);
      const metadataUri = await getSellerMetadataUri(seller1CoreSDK);

      // set seller address from seller 1 to random address
      const updateSellerResultRandom =
        await seller1CoreSDK.signMetaTxUpdateSeller({
          updateSellerArgs: {
            id: seller1.id,
            assistant: randomWallet.address,
            treasury: randomWallet.address,
            admin: randomWallet.address,
            clerk: randomWallet.address,
            authTokenId: "0",
            authTokenType: 0,
            metadataUri
          },
          nonce
        });

      // `Relayer` executes meta tx on behalf of random seller
      const metaTxUpdateSellerRandom =
        await seller1CoreSDK.relayMetaTransaction({
          functionName: updateSellerResultRandom.functionName,
          functionSignature: updateSellerResultRandom.functionSignature,
          nonce,
          sigR: updateSellerResultRandom.r,
          sigS: updateSellerResultRandom.s,
          sigV: updateSellerResultRandom.v
        });
      await metaTxUpdateSellerRandom.wait();

      await waitForGraphNodeIndexing();

      nonce = Date.now();
      const { r, s, v, functionName, functionSignature } =
        await randomCoreSDK.signMetaTxOptInToSellerUpdate({
          optInToSellerUpdateArgs: {
            id: seller1.id,
            fieldsToUpdate: {
              admin: true
            }
          },
          nonce
        });

      // `Relayer` executes meta tx on behalf of random seller
      const metaTx = await randomCoreSDK.relayMetaTransaction({
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

      await waitForGraphNodeIndexing();
      const existingSeller = await seller1CoreSDK.getSellerById(seller1.id);
      expect(existingSeller.pendingSeller?.admin).toBe(constants.AddressZero);
      expect(existingSeller.admin.toLowerCase()).toBe(
        randomWallet.address.toLowerCase()
      );
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
          nonce
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
          nonce
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

  describe("#signMetaTxCreateGroup()", () => {
    test("create group", async () => {
      const tokenID = Date.now().toString();
      const createdOffer = await createOffer(sellerCoreSDK);

      // Ensure the condition token is minted
      await ensureMintedERC1155(sellerWallet, tokenID, "5");

      // Create the group for the 3 offers and the token condition
      const offerIds = [createdOffer.id];
      const condition = {
        method: EvaluationMethod.Threshold,
        tokenType: TokenType.MultiToken,
        tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
        tokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      const groupToCreate = {
        offerIds,
        ...condition
      };
      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxCreateGroup({
          createGroupArgs: groupToCreate,
          nonce
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

      const [groupId] = await sellerCoreSDK.getCreatedGroupIdsFromLogs(
        metaTxReceipt.logs
      );
      expect(groupId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const tokenGatedOffer = await sellerCoreSDK.getOfferById(createdOffer.id);
      expect(tokenGatedOffer.condition).toBeTruthy();
    });
  });

  describe("#signMetaTxCreateOfferWithCondition()", () => {
    test("create offer with condition", async () => {
      const tokenID = Date.now().toString();
      const metadataHash = await sellerCoreSDK.storeMetadata({
        ...metadata,
        type: "BASE"
      });
      const metadataUri = "ipfs://" + metadataHash;

      const createOfferArgs = mockCreateOfferArgs({
        metadataHash,
        metadataUri
      });

      // Ensure the condition token is minted
      await ensureMintedERC1155(sellerWallet, tokenID, "5");

      // Create the group for the 3 offers and the token condition
      const condition = {
        method: EvaluationMethod.Threshold,
        tokenType: TokenType.MultiToken,
        tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
        tokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      const nonce = Date.now();

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxCreateOfferWithCondition({
          offerToCreate: createOfferArgs,
          condition,
          nonce
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

      const [groupId] = await sellerCoreSDK.getCreatedGroupIdsFromLogs(
        metaTxReceipt.logs
      );
      expect(groupId).toBeTruthy();
      const offerId = await sellerCoreSDK.getCreatedOfferIdFromLogs(
        metaTxReceipt.logs
      );
      expect(offerId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const tokenGatedOffer = await sellerCoreSDK.getOfferById(
        offerId as string
      );
      expect(tokenGatedOffer.condition).toBeTruthy();
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
          nonce
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
          nonce
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

  describe("#signMetaTxExtendOffer()", () => {
    test("extend created offer", async () => {
      const createdOffer = await createOffer(sellerCoreSDK);

      const nonce = Date.now();

      const newValidUntil = BigNumber.from(createdOffer.validUntilDate).add(
        1000
      );

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxExtendOffer({
          offerId: createdOffer.id,
          validUntil: newValidUntil,
          nonce
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

  describe("#signMetaTxExtendOfferBatch()", () => {
    test("extend created offers", async () => {
      const createdOffer1 = await createOffer(sellerCoreSDK);
      const createdOffer2 = await createOffer(sellerCoreSDK);

      const nonce = Date.now();

      const newValidUntil = BigNumber.from(createdOffer1.validUntilDate).add(
        1000
      );

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxExtendOfferBatch({
          offerIds: [createdOffer1.id, createdOffer2.id],
          validUntil: newValidUntil,
          nonce
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

      const allowance = await buyerCoreSDK.getProtocolAllowance(
        MOCK_ERC20_ADDRESS
      );
      expect(BigNumber.from(allowance).lt(offerToCommit.price)).toBe(true);

      // `Buyer` signs native meta tx for the token approval
      await approveErc20Token(
        buyerCoreSDK,
        MOCK_ERC20_ADDRESS,
        offerToCommit.price
      );

      const allowanceAfter = await buyerCoreSDK.getProtocolAllowance(
        MOCK_ERC20_ADDRESS
      );
      expect(BigNumber.from(allowanceAfter).gte(offerToCommit.price)).toBe(
        true
      );

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxCommitToOffer({
          offerId: offerToCommit.id,
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
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
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
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
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

  describe("#signMetaTxRevokeVoucher()", () => {
    test("non-native exchange token offer", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxRevokeVoucher({
          exchangeId: exchangeId as string,
          nonce
        });

      // `Relayer` executes meta tx on behalf of `Buyer`
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

  describe("#signMetaTxDepositFunds()", () => {
    test("approve and deposit funds (ERC20)", async () => {
      // Use the newSeller account, because the other seller funds balance is modified
      // by other tests (when the seller deposits or a buyer commits to their offer)
      const newSellerCoreSDK = initCoreSDKWithWallet(newSellerWallet);
      // do not approve for newSeller (we expect the test to do it when needed)
      await ensureMintedAndAllowedTokens([newSellerWallet], undefined, false);
      const sellers = await ensureCreatedSeller(newSellerWallet);
      const [seller] = sellers;

      const nonce = Date.now();
      const fundsAmount = BigNumber.from("100");
      const fundsTokenAddress = MOCK_ERC20_ADDRESS;

      const fundsBefore = await getFunds(
        newSellerCoreSDK,
        seller.id,
        fundsTokenAddress
      );

      // `Seller` signs native meta tx for the token approval
      await approveErc20Token(
        newSellerCoreSDK,
        MOCK_ERC20_ADDRESS,
        fundsAmount
      );

      const allowanceAfter = await newSellerCoreSDK.getProtocolAllowance(
        MOCK_ERC20_ADDRESS
      );
      expect(BigNumber.from(allowanceAfter).gte(fundsAmount)).toBe(true);

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxDepositFunds({
          sellerId: seller.id,
          fundsTokenAddress,
          fundsAmount,
          nonce
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await newSellerCoreSDK.relayMetaTransaction({
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

      await waitForGraphNodeIndexing();
      const fundsAfter = await getFunds(
        newSellerCoreSDK,
        seller.id,
        fundsTokenAddress
      );
      expect(
        BigNumber.from(fundsAfter).eq(
          BigNumber.from(fundsBefore).add(fundsAmount)
        )
      ).toBe(true);
    });
  });

  describe("#signMetaTxWithdrawFunds()", () => {
    test("withdraw funds (native)", async () => {
      // Use the newSeller account, because the other seller funds balance is modified
      // by other tests (when the seller deposits or a buyer commits to their offer)
      const newSellerCoreSDK = initCoreSDKWithWallet(newSellerWallet);
      const sellers = await ensureCreatedSeller(newSellerWallet);
      const [seller] = sellers;

      const fundsAmount = BigNumber.from("100");
      const fundsTokenAddress = ZERO_ADDRESS;

      const fundsBefore = await getFunds(
        newSellerCoreSDK,
        seller.id,
        fundsTokenAddress
      );

      const depositTx = await newSellerCoreSDK.depositFunds(
        seller.id,
        fundsAmount
      );
      await depositTx.wait();

      await waitForGraphNodeIndexing();
      const fundsAfterDeposit = await getFunds(
        newSellerCoreSDK,
        seller.id,
        fundsTokenAddress
      );

      expect(
        BigNumber.from(fundsAfterDeposit).eq(
          BigNumber.from(fundsBefore).add(fundsAmount)
        )
      ).toBe(true);

      const nonce = Date.now();
      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxWithdrawFunds({
          entityId: seller.id,
          tokenList: [fundsTokenAddress],
          tokenAmounts: [fundsAmount],
          nonce
        });

      // `Relayer` executes meta tx on behalf of seller
      const metaTx = await newSellerCoreSDK.relayMetaTransaction({
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

      await waitForGraphNodeIndexing();
      const fundsAfter = await getFunds(
        newSellerCoreSDK,
        seller.id,
        fundsTokenAddress
      );
      expect(BigNumber.from(fundsAfter).eq(fundsBefore)).toBe(true);
    });
  });

  describe("#signMetaTxRaiseDispute()", () => {
    test("raise dispute with meta-tx", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );
      expect(exchangeId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId as string);
      await redeemTx.wait();

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxRaiseDispute({
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

  describe("#signMetaTxRetractDispute()", () => {
    test("retract dispute with meta-tx", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );
      expect(exchangeId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId as string);
      await redeemTx.wait();

      const raiseDisputeTx = await buyerCoreSDK.raiseDispute(
        exchangeId as string
      );
      await raiseDisputeTx.wait();

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxRetractDispute({
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

  describe("#signMetaTxEscalateDispute()", () => {
    test("escalate dispute with meta-tx", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      );
      expect(exchangeId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId as string);
      await redeemTx.wait();

      const raiseDisputeTx = await buyerCoreSDK.raiseDispute(
        exchangeId as string
      );
      await raiseDisputeTx.wait();

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxEscalateDispute({
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

  describe("#signMetaTxResolveDispute()", () => {
    test("resolve dispute with meta-tx", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      ) as string;
      expect(exchangeId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId);
      await redeemTx.wait();

      const raiseDisputeTx = await buyerCoreSDK.raiseDispute(
        exchangeId as string
      );
      await raiseDisputeTx.wait();

      const buyerPercentBasisPoints = BigNumber.from("5000");

      // sign the proposition message from seller
      const counterpartySig = await sellerCoreSDK.signDisputeResolutionProposal(
        {
          exchangeId,
          buyerPercentBasisPoints
        }
      );

      const nonce = Date.now();

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxResolveDispute({
          exchangeId: Number(exchangeId),
          buyerPercent: buyerPercentBasisPoints,
          counterpartySig,
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

  describe("#signMetaTxExtendDisputeTimeout()", () => {
    test("extend dispute timeout with meta-tx", async () => {
      const commitTx = await buyerCoreSDK.commitToOffer(offerToCommit.id);
      const commitTxReceipt = await commitTx.wait();
      const exchangeId = buyerCoreSDK.getCommittedExchangeIdFromLogs(
        commitTxReceipt.logs
      ) as string;
      expect(exchangeId).toBeTruthy();
      await waitForGraphNodeIndexing();
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId);
      await redeemTx.wait();

      const raiseDisputeTx = await buyerCoreSDK.raiseDispute(
        exchangeId as string
      );
      await raiseDisputeTx.wait();
      await waitForGraphNodeIndexing();

      const dispute = await buyerCoreSDK.getDisputeById(exchangeId);
      const newTimeout = BigNumber.from(dispute.timeout).add(12).toString();
      const nonce = Date.now();

      // `Seller` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxExtendDisputeTimeout({
          exchangeId: Number(exchangeId),
          newTimeout,
          nonce
        });

      // `Relayer` executes meta tx on behalf of `Seller`
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

  describe("#signMetaTxReserveRange() & #signMetaTxPreMint()", () => {
    test("reserveRange for seller and preMint with meta-tx", async () => {
      const createdOffer = await createOffer(sellerCoreSDK);

      const length = 10;
      const offerId = createdOffer.id;
      const nonce = Date.now();

      const metaReserveRange = await sellerCoreSDK.signMetaTxReserveRange({
        offerId,
        length,
        to: "seller",
        nonce
      });

      let metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName: metaReserveRange.functionName,
        functionSignature: metaReserveRange.functionSignature,
        nonce,
        sigR: metaReserveRange.r,
        sigS: metaReserveRange.s,
        sigV: metaReserveRange.v
      });

      let metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

      const balanceBefore = await sellerCoreSDK.erc721BalanceOf({
        contractAddress: createdOffer.seller.voucherCloneAddress,
        owner: sellerAddress
      });
      const amount = 10;

      const { to, r, s, v, functionSignature } =
        await sellerCoreSDK.signMetaTxPreMint({
          offerId,
          amount
        });

      metaTx = await sellerCoreSDK.relayNativeMetaTransaction(
        to,
        {
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v
        },
        { metaTxConfig: { apiId: "dummy" } }
      );

      metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

      // check the seller assistant now owns the preminted vouchers
      const balanceAfter = await sellerCoreSDK.erc721BalanceOf({
        contractAddress: createdOffer.seller.voucherCloneAddress,
        owner: sellerAddress
      });
      expect(
        BigNumber.from(balanceAfter).sub(balanceBefore).toNumber()
      ).toEqual(amount);
    });

    test("reserveRange for contract and preMint with meta-tx", async () => {
      const createdOffer = await createOffer(sellerCoreSDK);

      const length = 10;
      const offerId = createdOffer.id;
      const nonce = Date.now();

      const metaReserveRange = await sellerCoreSDK.signMetaTxReserveRange({
        offerId,
        length,
        to: "contract",
        nonce
      });

      let metaTx = await sellerCoreSDK.relayMetaTransaction({
        functionName: metaReserveRange.functionName,
        functionSignature: metaReserveRange.functionSignature,
        nonce,
        sigR: metaReserveRange.r,
        sigS: metaReserveRange.s,
        sigV: metaReserveRange.v
      });

      let metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

      const balanceBefore = await sellerCoreSDK.erc721BalanceOf({
        contractAddress: createdOffer.seller.voucherCloneAddress,
        owner: createdOffer.seller.voucherCloneAddress
      });
      const amount = 10;

      const { to, r, s, v, functionSignature } =
        await sellerCoreSDK.signMetaTxPreMint({
          offerId,
          amount
        });

      metaTx = await sellerCoreSDK.relayNativeMetaTransaction(
        to,
        {
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v
        },
        { metaTxConfig: { apiId: "dummy" } }
      );

      metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

      // check the contract now owns the preminted vouchers
      const balanceAfter = await sellerCoreSDK.erc721BalanceOf({
        contractAddress: createdOffer.seller.voucherCloneAddress,
        owner: createdOffer.seller.voucherCloneAddress
      });
      expect(
        BigNumber.from(balanceAfter).sub(balanceBefore).toNumber()
      ).toEqual(amount);
    });

    test("can approve preminted tokens for contract", async () => {
      const createdOffer = await createOffer(sellerCoreSDK);

      const openseaConduit = Wallet.createRandom().address;
      const isApprovedForAllBefore = await sellerCoreSDK.isApprovedForAll(
        openseaConduit,
        { owner: createdOffer.seller.voucherCloneAddress }
      );
      expect(isApprovedForAllBefore).toEqual(false);

      const { to, r, s, v, functionSignature } =
        await sellerCoreSDK.signMetaTxSetApprovalForAllToContract({
          operator: openseaConduit,
          approved: true
        });

      const metaTx = await sellerCoreSDK.relayNativeMetaTransaction(
        to,
        {
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v
        },
        { metaTxConfig: { apiId: "dummy" } }
      );

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);

      const isApprovedForAllAfter = await sellerCoreSDK.isApprovedForAll(
        openseaConduit,
        { owner: createdOffer.seller.voucherCloneAddress }
      );
      expect(isApprovedForAllAfter).toEqual(true);
    });

    test("can call seaport via voucher contract to validate listing preminted tokens", async () => {
      // Create an offer
      const createdOffer = await createOffer(sellerCoreSDK);

      const range = 10;
      const offerId = createdOffer.id;

      // Reserve range
      await (
        await sellerCoreSDK.reserveRange(offerId, range, "contract")
      ).wait();
      const resultRange = await sellerCoreSDK.getRangeByOfferId(offerId);

      // Premint vouchers
      const amount = 10;
      await (await sellerCoreSDK.preMint(offerId, amount)).wait();

      // Find the first tokenId
      const tokenId = resultRange.start.toString();

      // Create the seaport order
      const openseaConduit = Wallet.createRandom().address;
      const order = createSeaportOrder({
        offerer: createdOffer.seller.voucherCloneAddress,
        token: createdOffer.seller.voucherCloneAddress,
        tokenId,
        openseaTreasury: openseaConduit
      });

      // Note: when using the real seaport contract, be sure the preminted tokens are approved for openseaConduit

      // Call seaport validate method via seller voucher
      const { to, r, s, v, functionSignature } =
        await sellerCoreSDK.signMetaTxCallExternalContract({
          to: MOCK_SEAPORT_ADDRESS,
          data: encodeValidate([order])
        });

      const metaTx = await sellerCoreSDK.relayNativeMetaTransaction(
        to,
        {
          functionSignature,
          sigR: r,
          sigS: s,
          sigV: v
        },
        { metaTxConfig: { apiId: "dummy" } }
      );

      const metaTxReceipt = await metaTx.wait();
      expect(metaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(true);
    });
  });
});

async function createOfferAndDepositFunds(sellerWallet: Wallet) {
  const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
  const sellers = await sellerCoreSDK.getSellersByAddress(sellerAddress);
  const [seller] = sellers;
  if (!seller) {
    throw new Error(
      `[createOfferAndDepositFunds] something went wrong while retrieveing seller using address=${sellerAddress}`
    );
  }
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

async function getFunds(
  coreSDK: CoreSDK,
  sellerId: string,
  tokenAddress: string
): Promise<string> {
  const funds = await coreSDK.getFunds({
    fundsFilter: {
      accountId: sellerId
    }
  });
  const fund = funds?.find(
    (fund) => fund.token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  return fund?.availableAmount || "0";
}

async function approveErc20Token(
  coreSDK: CoreSDK,
  tokenAddress: string,
  value: BigNumberish
) {
  const {
    r: r1,
    s: s1,
    v: v1,
    functionSignature: functionSignature1
  } = await coreSDK.signNativeMetaTxApproveExchangeToken(tokenAddress, value);

  const nativeMetaTx = await coreSDK.relayNativeMetaTransaction(tokenAddress, {
    functionSignature: functionSignature1,
    sigR: r1,
    sigS: s1,
    sigV: v1
  });
  const nativeMetaTxReceipt = await nativeMetaTx.wait();
  expect(nativeMetaTxReceipt.transactionHash).toBeTruthy();
  expect(BigNumber.from(nativeMetaTxReceipt.effectiveGasPrice).gt(0)).toBe(
    true
  );
}
