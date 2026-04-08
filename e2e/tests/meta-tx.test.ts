import { ZERO_ADDRESS } from "./../../packages/core-sdk/tests/mocks";
import { BigNumberish } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { Wallet, BigNumber, constants } from "ethers";
import { OfferFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { encodeValidate } from "../../packages/core-sdk/src/seaport/interface";

import {
  initCoreSDKWithWallet,
  MOCK_ERC20_ADDRESS,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  seedWallet7,
  seedWallet8,
  metadata,
  createOffer,
  seedWallet11,
  ensureMintedERC1155,
  MOCK_ERC1155_ADDRESS,
  initCoreSDKWithFundedWallet,
  createSeaportOrder,
  MOCK_SEAPORT_ADDRESS,
  createSeller,
  updateSellerMetaTx,
  getSellerMetadataUri,
  createOfferWithCondition,
  getCollectionMetadataUri,
  createRandomWallet,
  META_TX_API_ID_VOUCHER,
  createDisputeResolver,
  deployerWallet,
  initSellerAndBuyerSDKs,
  buildFullOfferArgs,
  provider,
  ipfsMetadataStorage,
  graphMetadataStorage,
  META_TX_API_KEY,
  META_TX_API_ID_BOSON,
  META_TX_API_ID_ERC20s,
  defaultConfig
} from "./utils";
import { CoreSDK, forwarder } from "../../packages/core-sdk/src";
import { getSignatureParameters } from "../../packages/core-sdk/src/utils/signature";
import { UnsignedMetaTx } from "../../packages/core-sdk/src/meta-tx/handler";
import { AgentAdapter } from "../../packages/ethers-sdk/src";
import EvaluationMethod from "../../contracts/protocol-contracts/scripts/domain/EvaluationMethod";
import TokenType from "../../contracts/protocol-contracts/scripts/domain/TokenType";
import {
  AuthTokenType,
  GatingType,
  OfferCreator,
  FullOfferArgs
} from "../../packages/common";
import {
  MSEC_PER_DAY,
  MSEC_PER_SEC
} from "./../../packages/common/src/utils/timestamp";

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
        // TODO: call newSellerCoreSDK.updateSellerSalt(existingSeller.id, <randomValue>)
        const { coreSDK: randomSellerCoreSDK, fundedWallet: randomWallet } =
          await initCoreSDKWithFundedWallet(sellerWallet);
        const metadataUri = await getSellerMetadataUri(randomSellerCoreSDK);
        const updateTx = await newSellerCoreSDK.updateSeller({
          id: existingSeller.id,
          admin: randomWallet.address,
          assistant: randomWallet.address,
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
            authToken: true
          }
        });
        await optinTx.wait();
      }
      const metadataUri = await getSellerMetadataUri(newSellerCoreSDK);
      const contractUri = await getCollectionMetadataUri(newSellerCoreSDK);

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxCreateSeller({
          createSellerArgs: {
            assistant: newSellerWallet.address,
            treasury: newSellerWallet.address,
            admin: newSellerWallet.address,
            contractUri,
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

      const randomWallet = createRandomWallet();
      const metadataUri = await getSellerMetadataUri(sellerCoreSDK);

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDK.signMetaTxUpdateSeller({
          updateSellerArgs: {
            id: seller.id,
            assistant: randomWallet.address,
            treasury: randomWallet.address,
            admin: randomWallet.address,
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

      await sellerCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
      const existingSeller = await sellerCoreSDK.getSellerById(seller.id);
      expect(existingSeller.pendingSeller?.admin).toBe(
        randomWallet.address.toLowerCase()
      );
    });
  });

  describe("#signMetaTxUpdateSellerAndOptIn", () => {
    test("update seller - replace all addresses", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);

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
          treasury: randomWallet.address,
          metadataUri
        },
        [
          {
            coreSDK: coreSDK2,
            fieldsToUpdate: {
              admin: true,
              assistant: true
            }
          }
        ]
      );
      expect(seller).toBeTruthy();
      expect(seller.assistant).toEqual(randomWallet.address.toLowerCase());
      expect(seller.clerk).toEqual(ZERO_ADDRESS);
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
      const randomWallet = createRandomWallet();
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

      await seller1CoreSDK.waitForGraphNodeIndexing(metaTxUpdateSellerRandom);

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

      await randomCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
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
        gatingType: GatingType.PerAddress,
        minTokenId: tokenID,
        maxTokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      const groupToCreate = {
        sellerId: createdOffer.seller.id,
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
      await sellerCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
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
        gatingType: GatingType.PerAddress,
        minTokenId: tokenID,
        maxTokenId: tokenID,
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
      await sellerCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
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

      // `Buyer` signs native meta tx for the token approval
      await approveErc20Token(
        buyerCoreSDK,
        MOCK_ERC20_ADDRESS,
        offerToCommit.price
      );

      const allowanceAfter =
        await buyerCoreSDK.getProtocolAllowance(MOCK_ERC20_ADDRESS);
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

  describe("#signMetaTxCommitToConditionalOffer()", () => {
    test("non-native exchange token conditional offer", async () => {
      const tokenID = Date.now().toString();

      // Ensure the condition token is minted
      await ensureMintedERC1155(buyerWallet, tokenID, "5");

      const condition = {
        method: EvaluationMethod.Threshold,
        tokenType: TokenType.MultiToken,
        tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
        gatingType: GatingType.PerAddress,
        minTokenId: tokenID,
        maxTokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      const createdOffer = await createOfferWithCondition(
        sellerCoreSDK,
        condition,
        {
          offerParams: { exchangeToken: MOCK_ERC20_ADDRESS }
        }
      );
      const nonce = Date.now();

      // `Buyer` signs native meta tx for the token approval
      await approveErc20Token(
        buyerCoreSDK,
        MOCK_ERC20_ADDRESS,
        createdOffer.price
      );

      const allowanceAfter =
        await buyerCoreSDK.getProtocolAllowance(MOCK_ERC20_ADDRESS);
      expect(BigNumber.from(allowanceAfter).gte(createdOffer.price)).toBe(true);

      // `Buyer` signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDK.signMetaTxCommitToConditionalOffer({
          offerId: createdOffer.id,
          tokenId: tokenID,
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

  describe("#signMetaTxCommitToBuyerOffer()", () => {
    test("native exchange token buyer-initiated offer", async () => {
      const exchangeToken = constants.AddressZero;
      // drFeeAmount must be 0 so the seller doesn't need to deposit funds before
      // committing via meta-tx (meta-tx can't carry ETH value)
      const drFeeAmount = "0";

      // Create a dispute resolver with zero fee (required for meta-tx compatibility)
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "Native"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKBuyer,
        buyerCoreSDK: buyerCoreSDKBuyer,
        sellerWallet: sellerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Buyer creates a buyer-initiated offer.
      // sellerDeposit must be 0 so the meta-tx relayer doesn't need to forward ETH value.
      const buyerInitiatedOffer = await createOffer(buyerCoreSDKBuyer, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 1,
        disputeResolverId: disputeResolver.id,
        exchangeToken,
        sellerDeposit: "0"
      });

      // Buyer deposits offer.price to allow the seller to commit
      const buyerDepositTx = await buyerCoreSDKBuyer.depositFunds(
        buyerInitiatedOffer.buyerId,
        buyerInitiatedOffer.price,
        exchangeToken
      );
      await buyerCoreSDKBuyer.waitForGraphNodeIndexing(buyerDepositTx);

      // Seller creates a seller account
      await createSeller(sellerCoreSDKBuyer, sellerFundedWallet.address);
      // No seller depositFunds needed: drFeeAmount = 0 and sellerDeposit = 0

      const nonce = Date.now();

      // Seller signs meta tx for commitToBuyerOffer
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDKBuyer.signMetaTxCommitToBuyerOffer({
          offerId: buyerInitiatedOffer.id,
          sellerParams: {},
          nonce
        });

      // Relayer executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDKBuyer.relayMetaTransaction({
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

    test("non-native exchange token buyer-initiated offer", async () => {
      const exchangeToken = MOCK_ERC20_ADDRESS;
      const drFeeAmount = parseEther("0.001");

      // Create a dispute resolver with an ERC20 fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "ERC20"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKBuyer,
        buyerCoreSDK: buyerCoreSDKBuyer,
        sellerWallet: sellerFundedWallet,
        buyerWallet: buyerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Mint ERC20 tokens to fresh wallets (they start with 0 ERC20 balance)
      await ensureMintedAndAllowedTokens(
        [buyerFundedWallet, sellerFundedWallet],
        undefined,
        false
      );

      // Buyer creates a buyer-initiated offer with ERC20 exchange token.
      // sellerDeposit is 0 to simplify the test setup.
      const buyerInitiatedOffer = await createOffer(buyerCoreSDKBuyer, {
        creator: OfferCreator.Buyer,
        quantityAvailable: 1,
        disputeResolverId: disputeResolver.id,
        exchangeToken,
        sellerDeposit: "0"
      });

      // Buyer approves ERC20 and deposits offer.price
      await approveErc20Token(
        buyerCoreSDKBuyer,
        exchangeToken,
        buyerInitiatedOffer.price
      );
      const buyerDepositTx = await buyerCoreSDKBuyer.depositFunds(
        buyerInitiatedOffer.buyerId,
        buyerInitiatedOffer.price,
        exchangeToken
      );
      await buyerCoreSDKBuyer.waitForGraphNodeIndexing(buyerDepositTx);

      // Seller creates a seller account
      const seller = await createSeller(
        sellerCoreSDKBuyer,
        sellerFundedWallet.address
      );

      // Seller approves ERC20 and deposits drFeeAmount into the protocol
      await approveErc20Token(sellerCoreSDKBuyer, exchangeToken, drFeeAmount);
      const sellerDepositTx = await sellerCoreSDKBuyer.depositFunds(
        seller.id,
        drFeeAmount,
        exchangeToken
      );
      await sellerCoreSDKBuyer.waitForGraphNodeIndexing(sellerDepositTx);

      const nonce = Date.now();

      // Seller signs meta tx for commitToBuyerOffer
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDKBuyer.signMetaTxCommitToBuyerOffer({
          offerId: buyerInitiatedOffer.id,
          sellerParams: {},
          nonce
        });

      // Relayer executes meta tx on behalf of seller
      const metaTx = await sellerCoreSDKBuyer.relayMetaTransaction({
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

  describe("#signMetaTxCreateOfferAndCommit()", () => {
    const noCondition = {
      method: EvaluationMethod.None,
      tokenType: TokenType.MultiToken,
      tokenAddress: constants.AddressZero,
      gatingType: GatingType.PerAddress,
      minTokenId: 0,
      maxTokenId: 0,
      threshold: 0,
      maxCommits: 0
    };

    test("native exchange token buyer-initiated offer", async () => {
      const exchangeToken = constants.AddressZero;
      // sellerDeposit and drFeeAmount are 0 so the seller (committer) doesn't
      // need to deposit any funds prior to the commit
      const sellerDeposit = "0";
      const drFeeAmount = "0";

      // Create a dispute resolver with zero native fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "Native"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKNew,
        buyerCoreSDK: buyerCoreSDKNew,
        sellerWallet: sellerFundedWallet,
        buyerWallet: buyerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Create seller account (seller is committer for buyer-initiated offer)
      const seller = await createSeller(
        sellerCoreSDKNew,
        sellerFundedWallet.address
      );

      // Build full offer args for buyer-initiated offer:
      // buyer is offer creator, seller is committer
      const fullOfferArgsUnsigned = await buildFullOfferArgs(
        sellerCoreSDKNew, // seller calls createOfferAndCommit
        buyerCoreSDKNew, // buyer signs the offer
        noCondition,
        {
          committer: sellerFundedWallet.address,
          offerCreator: buyerFundedWallet.address,
          sellerId: seller.id,
          sellerOfferParams: {
            collectionIndex: 0,
            mutualizerAddress: constants.AddressZero,
            royaltyInfo: { recipients: [], bps: [] }
          },
          useDepositedFunds: true,
          creator: OfferCreator.Buyer,
          feeLimit: parseEther("0.1")
        },
        {
          offerParams: {
            disputeResolverId: disputeResolver.id,
            sellerDeposit,
            quantityAvailable: 1 // must be 1 for buyer-initiated offers
          }
        }
      );

      // Buyer (offer creator) signs the full offer
      const { signature } = await buyerCoreSDKNew.signFullOffer({
        fullOfferArgsUnsigned
      });
      const fullOfferArgs: FullOfferArgs = {
        ...fullOfferArgsUnsigned,
        signature
      };

      const nonce = Date.now();

      // Seller signs meta-tx for createOfferAndCommit
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDKNew.signMetaTxCreateOfferAndCommit({
          createOfferAndCommitArgs: fullOfferArgs,
          nonce
        });

      // Relayer executes meta-tx on behalf of seller
      const metaTx = await sellerCoreSDKNew.relayMetaTransaction({
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

    test("non-native exchange token buyer-initiated offer", async () => {
      const exchangeToken = MOCK_ERC20_ADDRESS;
      // sellerDeposit and drFeeAmount are 0 so the seller (committer) doesn't
      // need to deposit any ERC20 tokens prior to the commit
      const sellerDeposit = "0";
      const drFeeAmount = "0";

      // Create a dispute resolver with zero ERC20 fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "ERC20"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKNew,
        buyerCoreSDK: buyerCoreSDKNew,
        sellerWallet: sellerFundedWallet,
        buyerWallet: buyerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Mint ERC20 tokens to fresh wallets (they start with 0 ERC20 balance)
      await ensureMintedAndAllowedTokens(
        [buyerFundedWallet, sellerFundedWallet],
        undefined,
        false
      );

      // Create seller account (seller is committer for buyer-initiated offer)
      const seller = await createSeller(
        sellerCoreSDKNew,
        sellerFundedWallet.address
      );

      // Build full offer args for buyer-initiated offer with ERC20 exchange token:
      // buyer is offer creator (deposits price in ERC20), seller is committer (pays sellerDeposit=0)
      const fullOfferArgsUnsigned = await buildFullOfferArgs(
        sellerCoreSDKNew, // seller calls createOfferAndCommit
        buyerCoreSDKNew, // buyer signs the offer
        noCondition,
        {
          committer: sellerFundedWallet.address,
          offerCreator: buyerFundedWallet.address,
          sellerId: seller.id,
          sellerOfferParams: {
            collectionIndex: 0,
            mutualizerAddress: constants.AddressZero,
            royaltyInfo: { recipients: [], bps: [] }
          },
          useDepositedFunds: true,
          creator: OfferCreator.Buyer,
          feeLimit: parseEther("0.1")
        },
        {
          offerParams: {
            disputeResolverId: disputeResolver.id,
            exchangeToken,
            sellerDeposit,
            quantityAvailable: 1 // must be 1 for buyer-initiated offers
          }
        }
      );

      // Buyer (offer creator) signs the full offer
      const { signature } = await buyerCoreSDKNew.signFullOffer({
        fullOfferArgsUnsigned
      });
      const fullOfferArgs: FullOfferArgs = {
        ...fullOfferArgsUnsigned,
        signature
      };

      const nonce = Date.now();

      // Seller signs meta-tx for createOfferAndCommit
      const { r, s, v, functionName, functionSignature } =
        await sellerCoreSDKNew.signMetaTxCreateOfferAndCommit({
          createOfferAndCommitArgs: fullOfferArgs,
          nonce
        });

      // Relayer executes meta-tx on behalf of seller
      const metaTx = await sellerCoreSDKNew.relayMetaTransaction({
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

    test("native exchange token seller-initiated offer", async () => {
      const exchangeToken = constants.AddressZero;
      // price, sellerDeposit, and drFeeAmount are 0 so neither party needs to
      // forward ETH value through the meta-tx relayer
      const price = "0";
      const sellerDeposit = "0";
      const drFeeAmount = "0";

      // Create a dispute resolver with zero native fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "Native"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKNew,
        buyerCoreSDK: buyerCoreSDKNew,
        sellerWallet: sellerFundedWallet,
        buyerWallet: buyerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Create seller account (seller is offer creator for seller-initiated offer)
      const seller = await createSeller(
        sellerCoreSDKNew,
        sellerFundedWallet.address
      );

      // Build full offer args for seller-initiated offer:
      // seller is offer creator, buyer is committer (pays price=0)
      const fullOfferArgsUnsigned = await buildFullOfferArgs(
        buyerCoreSDKNew, // buyer calls createOfferAndCommit
        sellerCoreSDKNew, // seller signs the offer
        noCondition,
        {
          committer: buyerFundedWallet.address,
          offerCreator: sellerFundedWallet.address,
          sellerId: seller.id,
          sellerOfferParams: {
            collectionIndex: 0,
            mutualizerAddress: constants.AddressZero,
            royaltyInfo: { recipients: [], bps: [] }
          },
          useDepositedFunds: true,
          creator: OfferCreator.Seller,
          feeLimit: parseEther("0.1")
        },
        {
          offerParams: {
            disputeResolverId: disputeResolver.id,
            price,
            sellerDeposit,
            buyerCancelPenalty: "0" // must be <= price (which is 0)
          }
        }
      );

      // Seller (offer creator) signs the full offer
      const { signature } = await sellerCoreSDKNew.signFullOffer({
        fullOfferArgsUnsigned
      });
      const fullOfferArgs: FullOfferArgs = {
        ...fullOfferArgsUnsigned,
        signature
      };

      const nonce = Date.now();

      // Buyer signs meta-tx for createOfferAndCommit
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDKNew.signMetaTxCreateOfferAndCommit({
          createOfferAndCommitArgs: fullOfferArgs,
          nonce
        });

      // Relayer executes meta-tx on behalf of buyer
      const metaTx = await buyerCoreSDKNew.relayMetaTransaction({
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

    test("non-native exchange token seller-initiated offer", async () => {
      const exchangeToken = MOCK_ERC20_ADDRESS;
      // sellerDeposit and drFeeAmount are 0 so the seller doesn't need to deposit
      // any funds prior to the commit
      const sellerDeposit = "0";
      const drFeeAmount = "0";

      // Create a dispute resolver with zero ERC20 fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "ERC20"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKNew,
        buyerCoreSDK: buyerCoreSDKNew,
        sellerWallet: sellerFundedWallet,
        buyerWallet: buyerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Mint ERC20 tokens to fresh wallets (they start with 0 ERC20 balance)
      await ensureMintedAndAllowedTokens(
        [buyerFundedWallet, sellerFundedWallet],
        undefined,
        false
      );

      // Create seller account (seller is offer creator for seller-initiated offer)
      const seller = await createSeller(
        sellerCoreSDKNew,
        sellerFundedWallet.address
      );

      // Build full offer args for seller-initiated offer with ERC20 exchange token:
      // seller is offer creator (deposits sellerDeposit=0), buyer is committer (pays price in ERC20)
      const fullOfferArgsUnsigned = await buildFullOfferArgs(
        buyerCoreSDKNew, // buyer calls createOfferAndCommit
        sellerCoreSDKNew, // seller signs the offer
        noCondition,
        {
          committer: buyerFundedWallet.address,
          offerCreator: sellerFundedWallet.address,
          sellerId: seller.id,
          sellerOfferParams: {
            collectionIndex: 0,
            mutualizerAddress: constants.AddressZero,
            royaltyInfo: { recipients: [], bps: [] }
          },
          useDepositedFunds: true,
          creator: OfferCreator.Seller,
          feeLimit: parseEther("0.1")
        },
        {
          offerParams: {
            disputeResolverId: disputeResolver.id,
            exchangeToken,
            sellerDeposit
          }
        }
      );

      // Seller (offer creator) signs the full offer
      const { signature } = await sellerCoreSDKNew.signFullOffer({
        fullOfferArgsUnsigned
      });
      const fullOfferArgs: FullOfferArgs = {
        ...fullOfferArgsUnsigned,
        signature
      };

      // Buyer (committer) pre-approves ERC20 token for price amount
      await approveErc20Token(
        buyerCoreSDKNew,
        exchangeToken,
        fullOfferArgsUnsigned.price
      );

      const nonce = Date.now();

      // Buyer signs meta-tx for createOfferAndCommit
      const { r, s, v, functionName, functionSignature } =
        await buyerCoreSDKNew.signMetaTxCreateOfferAndCommit({
          createOfferAndCommitArgs: fullOfferArgs,
          nonce
        });

      // Relayer executes meta-tx on behalf of buyer
      const metaTx = await buyerCoreSDKNew.relayMetaTransaction({
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

  describe("open-boson-buyer-flow", () => {
    test("seller-initiated offer with AgentAdapter and returnTypedDataToSign", async () => {
      const exchangeToken = MOCK_ERC20_ADDRESS;
      const sellerDeposit = "0";
      const drFeeAmount = "0";

      // Create a dispute resolver with zero ERC20 fee
      const { fundedWallet: drFundedWallet } =
        await initCoreSDKWithFundedWallet(sellerWallet);
      const drAddress = drFundedWallet.address.toLowerCase();
      const { disputeResolver } = await createDisputeResolver(
        drFundedWallet,
        deployerWallet,
        {
          assistant: drAddress,
          admin: drAddress,
          treasury: drAddress,
          metadataUri: "",
          escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
          fees: [
            {
              feeAmount: drFeeAmount,
              tokenAddress: exchangeToken,
              tokenName: "ERC20"
            }
          ],
          sellerAllowList: []
        }
      );

      // Create fresh buyer/seller wallets
      const {
        sellerCoreSDK: sellerCoreSDKNew,
        buyerWallet: buyerFundedWallet,
        sellerWallet: sellerFundedWallet
      } = await initSellerAndBuyerSDKs(sellerWallet);

      // Mint ERC20 tokens to fresh wallets (they start with 0 ERC20 balance)
      await ensureMintedAndAllowedTokens(
        [buyerFundedWallet, sellerFundedWallet],
        undefined,
        false
      );

      // Create seller account
      const seller = await createSeller(
        sellerCoreSDKNew,
        sellerFundedWallet.address
      );

      // Create buyer CoreSDK with AgentAdapter (no signer — all signing done externally)
      const apiIds = {
        [defaultConfig.contracts.protocolDiamond.toLowerCase()]: {
          executeMetaTransaction: META_TX_API_ID_BOSON
        },
        [(defaultConfig.contracts.testErc20 as string).toLowerCase()]: {
          executeMetaTransaction: META_TX_API_ID_ERC20s
        }
      };
      const buyerCoreSdk = CoreSDK.fromDefaultConfig({
        envName: "local",
        configId: "local-31337-0",
        web3Lib: new AgentAdapter(provider, {
          signerAddress: buyerFundedWallet.address
        }),
        metadataStorage: ipfsMetadataStorage,
        theGraphStorage: graphMetadataStorage,
        metaTx: {
          apiKey: META_TX_API_KEY,
          apiIds
        }
      });

      const noCondition = {
        method: EvaluationMethod.None,
        tokenType: TokenType.MultiToken,
        tokenAddress: constants.AddressZero,
        gatingType: GatingType.PerAddress,
        minTokenId: 0,
        maxTokenId: 0,
        threshold: 0,
        maxCommits: 0
      };

      // Build full offer args for seller-initiated offer with ERC20 exchange token:
      // seller is offer creator (deposits sellerDeposit=0), buyer is committer (pays price in ERC20)
      const fullOfferArgsUnsigned = await buildFullOfferArgs(
        buyerCoreSdk,
        sellerCoreSDKNew,
        noCondition,
        {
          committer: buyerFundedWallet.address,
          offerCreator: sellerFundedWallet.address,
          sellerId: seller.id,
          sellerOfferParams: {
            collectionIndex: 0,
            mutualizerAddress: constants.AddressZero,
            royaltyInfo: { recipients: [], bps: [] }
          },
          useDepositedFunds: true,
          creator: OfferCreator.Seller,
          feeLimit: parseEther("0.1")
        },
        {
          offerParams: {
            disputeResolverId: disputeResolver.id,
            exchangeToken,
            sellerDeposit
          }
        }
      );

      // Seller (offer creator) signs the full offer
      const { signature } = await sellerCoreSDKNew.signFullOffer({
        fullOfferArgsUnsigned
      });
      const fullOfferArgs: FullOfferArgs = {
        ...fullOfferArgsUnsigned,
        signature
      };

      // Buyer pre-approves ERC20 token via native meta tx with returnTypedDataToSign
      const approveStructuredData =
        await buyerCoreSdk.signNativeMetaTxApproveExchangeToken(
          exchangeToken,
          fullOfferArgsUnsigned.price,
          { returnTypedDataToSign: true }
        );
      const { EIP712Domain: _approveDomain, ...approveTypesWithoutDomain } =
        approveStructuredData.types;
      const approveRawSignature = await buyerFundedWallet._signTypedData(
        approveStructuredData.domain,
        approveTypesWithoutDomain,
        approveStructuredData.message
      );
      const {
        r: approveR,
        s: approveS,
        v: approveV
      } = getSignatureParameters(approveRawSignature);
      console.log(
        "DEBUG approveStructuredData.message:",
        JSON.stringify(approveStructuredData.message)
      );
      console.log(
        "DEBUG approveStructuredData.domain:",
        JSON.stringify(approveStructuredData.domain)
      );
      console.log("DEBUG approveR:", approveR);
      console.log("DEBUG approveS:", approveS);
      console.log("DEBUG approveV:", approveV);
      console.log("DEBUG exchangeToken:", exchangeToken);
      const nativeMetaTx = await buyerCoreSdk.relayNativeMetaTransaction(
        exchangeToken,
        {
          functionSignature: approveStructuredData.functionSignature,
          sigR: approveR,
          sigS: approveS,
          sigV: approveV
        }
      );
      const nativeMetaTxReceipt = await nativeMetaTx.wait();
      expect(nativeMetaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(nativeMetaTxReceipt.effectiveGasPrice).gt(0)).toBe(
        true
      );

      // Buyer signs meta-tx for createOfferAndCommit with returnTypedDataToSign
      const commitNonce = Date.now();
      const signCommit =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buyerCoreSdk.signMetaTxCreateOfferAndCommit.bind(buyerCoreSdk) as any;
      const commitStructuredData = (await signCommit({
        createOfferAndCommitArgs: fullOfferArgs,
        nonce: commitNonce,
        returnTypedDataToSign: true
      })) as UnsignedMetaTx;
      const { EIP712Domain: _commitDomain, ...commitTypesWithoutDomain } =
        commitStructuredData.types;
      const commitRawSignature = await buyerFundedWallet._signTypedData(
        commitStructuredData.domain,
        commitTypesWithoutDomain,
        commitStructuredData.message
      );
      const {
        r: commitR,
        s: commitS,
        v: commitV
      } = getSignatureParameters(commitRawSignature);
      const commitMetaTx = await buyerCoreSdk.relayMetaTransaction({
        functionName: commitStructuredData.functionName,
        functionSignature: commitStructuredData.functionSignature,
        nonce: commitNonce,
        sigR: commitR,
        sigS: commitS,
        sigV: commitV
      });
      const commitMetaTxReceipt = await commitMetaTx.wait();
      expect(commitMetaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(commitMetaTxReceipt.effectiveGasPrice).gt(0)).toBe(
        true
      );

      // Get the exchange ID from the commit receipt
      const exchangeId = buyerCoreSdk.getCommittedExchangeIdFromLogs(
        commitMetaTxReceipt.logs
      );
      expect(exchangeId).toBeTruthy();

      // Buyer redeems the voucher via meta-tx with returnTypedDataToSign
      const redeemNonce = Date.now();
      const signRedeem =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buyerCoreSdk.signMetaTxRedeemVoucher.bind(buyerCoreSdk) as any;
      const redeemStructuredData = (await signRedeem({
        exchangeId: Number(exchangeId),
        nonce: redeemNonce,
        returnTypedDataToSign: true
      })) as UnsignedMetaTx;
      const { EIP712Domain: _redeemDomain, ...redeemTypesWithoutDomain } =
        redeemStructuredData.types;
      const redeemRawSignature = await buyerFundedWallet._signTypedData(
        redeemStructuredData.domain,
        redeemTypesWithoutDomain,
        redeemStructuredData.message
      );
      const {
        r: redeemR,
        s: redeemS,
        v: redeemV
      } = getSignatureParameters(redeemRawSignature);
      const redeemMetaTx = await buyerCoreSdk.relayMetaTransaction({
        functionName: redeemStructuredData.functionName,
        functionSignature: redeemStructuredData.functionSignature,
        nonce: redeemNonce,
        sigR: redeemR,
        sigS: redeemS,
        sigV: redeemV
      });
      const redeemMetaTxReceipt = await redeemMetaTx.wait();
      expect(redeemMetaTxReceipt.transactionHash).toBeTruthy();
      expect(BigNumber.from(redeemMetaTxReceipt.effectiveGasPrice).gt(0)).toBe(
        true
      );
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

      const allowanceAfter =
        await newSellerCoreSDK.getProtocolAllowance(MOCK_ERC20_ADDRESS);
      expect(BigNumber.from(allowanceAfter).gte(fundsAmount)).toBe(true);

      // Seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxDepositFunds({
          entityId: seller.id,
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

      await newSellerCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
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

      await newSellerCoreSDK.waitForGraphNodeIndexing(depositTx);
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

      await newSellerCoreSDK.waitForGraphNodeIndexing(metaTxReceipt);
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
      await buyerCoreSDK.waitForGraphNodeIndexing(commitTxReceipt);
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
      await buyerCoreSDK.waitForGraphNodeIndexing(commitTxReceipt);
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
      await buyerCoreSDK.waitForGraphNodeIndexing(commitTxReceipt);
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
      await buyerCoreSDK.waitForGraphNodeIndexing(commitTxReceipt);
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
      await buyerCoreSDK.waitForGraphNodeIndexing(commitTxReceipt);
      const redeemTx = await buyerCoreSDK.redeemVoucher(exchangeId);
      await redeemTx.wait();

      const raiseDisputeTx = await buyerCoreSDK.raiseDispute(
        exchangeId as string
      );
      await raiseDisputeTx.wait();
      await buyerCoreSDK.waitForGraphNodeIndexing(raiseDisputeTx);

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

      const { to, signature, domainSeparator, request } =
        await sellerCoreSDK.signMetaTxPreMint({
          offerId,
          amount
        });

      metaTx = await sellerCoreSDK.relayBiconomyMetaTransaction(
        to,
        {
          request: request as forwarder.biconomy.ERC20ForwardRequest,
          domainSeparator:
            domainSeparator ??
            "0x305def757d40eaccb764a44e4a9d5ec89af56886451ff9348822884eb7a9674a",
          signature
        },
        { metaTxConfig: { apiId: META_TX_API_ID_VOUCHER } }
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

      const { to, signature, domainSeparator, request } =
        await sellerCoreSDK.signMetaTxPreMint({
          offerId,
          amount
        });

      metaTx = await sellerCoreSDK.relayBiconomyMetaTransaction(
        to,
        {
          request: request as forwarder.biconomy.ERC20ForwardRequest,
          domainSeparator:
            domainSeparator ??
            "0x305def757d40eaccb764a44e4a9d5ec89af56886451ff9348822884eb7a9674a",
          signature
        },
        { metaTxConfig: { apiId: META_TX_API_ID_VOUCHER } }
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

      const openseaConduit = createRandomWallet().address;
      const isApprovedForAllBefore = await sellerCoreSDK.isApprovedForAll(
        openseaConduit,
        { owner: createdOffer.seller.voucherCloneAddress }
      );
      expect(isApprovedForAllBefore).toEqual(false);

      const { to, signature, domainSeparator, request } =
        await sellerCoreSDK.signMetaTxSetApprovalForAllToContract({
          operator: openseaConduit,
          approved: true
        });

      const metaTx = await sellerCoreSDK.relayBiconomyMetaTransaction(
        to,
        {
          request: request as forwarder.biconomy.ERC20ForwardRequest,
          domainSeparator:
            domainSeparator ??
            "0x305def757d40eaccb764a44e4a9d5ec89af56886451ff9348822884eb7a9674a",
          signature
        },
        { metaTxConfig: { apiId: META_TX_API_ID_VOUCHER } }
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
      const openseaConduit = createRandomWallet().address;
      const order = createSeaportOrder({
        offerer: createdOffer.seller.voucherCloneAddress,
        token: createdOffer.seller.voucherCloneAddress,
        tokenId,
        openseaTreasury: openseaConduit
      });

      // Note: when using the real seaport contract, be sure the preminted tokens are approved for openseaConduit

      // Call seaport validate method via seller voucher
      const { to, signature, domainSeparator, request } =
        await sellerCoreSDK.signMetaTxCallExternalContract({
          to: MOCK_SEAPORT_ADDRESS,
          data: encodeValidate([order])
        });

      const metaTx = await sellerCoreSDK.relayBiconomyMetaTransaction(
        to,
        {
          request: request as forwarder.biconomy.ERC20ForwardRequest,
          domainSeparator:
            domainSeparator ??
            "0x305def757d40eaccb764a44e4a9d5ec89af56886451ff9348822884eb7a9674a",
          signature
        },
        { metaTxConfig: { apiId: META_TX_API_ID_VOUCHER } }
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
  await sellerCoreSDK.waitForGraphNodeIndexing(depositFundsTx);

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
