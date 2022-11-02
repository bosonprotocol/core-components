import { ZERO_ADDRESS } from "./../../packages/core-sdk/tests/mocks";
import { BigNumberish } from "@ethersproject/bignumber";
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
  createOffer,
  seedWallet11,
  ensureMintedERC1155,
  MOCK_ERC1155_ADDRESS
} from "./utils";
import { CoreSDK } from "../../packages/core-sdk/src";
import EvaluationMethod from "../../contracts/protocol-contracts/scripts/domain/EvaluationMethod";
import TokenType from "../../contracts/protocol-contracts/scripts/domain/TokenType";

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
        const randomWallet = Wallet.createRandom();
        const updateTx = await newSellerCoreSDK.updateSeller({
          id: existingSeller.id,
          admin: randomWallet.address,
          operator: randomWallet.address,
          clerk: randomWallet.address,
          treasury: randomWallet.address,
          authTokenId: "0",
          authTokenType: 0
        });
        await updateTx.wait();
      }

      // Random seller signs meta tx
      const { r, s, v, functionName, functionSignature } =
        await newSellerCoreSDK.signMetaTxCreateSeller({
          createSellerArgs: {
            operator: newSellerWallet.address,
            treasury: newSellerWallet.address,
            admin: newSellerWallet.address,
            clerk: newSellerWallet.address,
            // TODO: replace with correct uri
            contractUri: "ipfs://seller-contract",
            royaltyPercentage: "0",
            authTokenId: "0",
            authTokenType: 0
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
});

async function createOfferAndDepositFunds(sellerWallet: Wallet) {
  const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
  const sellers = await sellerCoreSDK.getSellersByAddress(sellerAddress);
  const [seller] = sellers;
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
