import { parseEther } from "@ethersproject/units";
import { DAY_IN_MS, DAY_IN_SEC } from "./../../packages/core-sdk/tests/mocks";
import {
  DisputeState,
  ExchangeFieldsFragment
} from "./../../packages/core-sdk/src/subgraph";
import { utils, constants, BigNumber, BigNumberish } from "ethers";

import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import { CoreSDK } from "../../packages/core-sdk/src";
import {
  ExchangeState,
  FundsEntityFieldsFragment
} from "../../packages/core-sdk/src/subgraph";

import {
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  metadata,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  MOCK_ERC20_ADDRESS,
  waitForGraphNodeIndexing,
  seedWallet4,
  seedWallet5,
  seedWallet6,
  initCoreSDKWithWallet,
  drWallet,
  createOffer,
  MOCK_ERC721_ADDRESS,
  ensureMintedERC721,
  MOCK_ERC1155_ADDRESS,
  ensureMintedERC1155,
  createOfferWithCondition,
  createSellerAndOfferWithCondition,
  createSeller,
  createSellerAndOffer
} from "./utils";
import { EvaluationMethod, TokenType } from "@bosonprotocol/common";

const seedWallet = seedWallet4; // be sure the seedWallet is not used by another test (to allow concurrent run)
const sellerWallet2 = seedWallet5; // be sure the seedWallet is not used by another test (to allow concurrent run)
const buyerWallet2 = seedWallet6; // be sure the seedWallet is not used by another test (to allow concurrent run)

jest.setTimeout(60_000);

describe("core-sdk", () => {
  describe("core user flows", () => {
    test("create seller and offer", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );

      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      expect(createdOffer).toBeTruthy();
      expect(createdOffer.metadata).toMatchObject(metadata);
      expect(createdOffer.seller).toBeTruthy();
      expect(createdOffer.seller.operator.toLowerCase()).toBe(
        fundedWallet.address.toLowerCase()
      );
      expect(createdOffer.disputeResolver.fees.length > 0).toBeTruthy();
      expect(BigNumber.from(createdOffer.voucherValidDuration).eq(0)).toBe(
        true
      ); // By default, the validity period is created with dateFrom - dateTo
    });

    test("create seller, then create offer", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );

      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      await checkDisputeResolver(coreSDK, seller.id, 1);

      // Create an offer with validity duration instead of period
      const createdOffer = await createOffer(coreSDK, {
        voucherRedeemableUntilDateInMS: 0,
        voucherValidDurationInMS: 30 * DAY_IN_MS
      });
      expect(createdOffer).toBeTruthy();
      const voucherValidDuration = 30 * DAY_IN_SEC;
      expect(
        BigNumber.from(createdOffer.voucherValidDuration).eq(
          voucherValidDuration
        )
      ).toBe(true);
      expect(
        BigNumber.from(createdOffer.voucherRedeemableUntilDate).eq(0)
      ).toBe(true);
    });

    describe("deposit funds", () => {
      test("ETH", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
          seedWallet
        );
        const sellers = await ensureCreatedSeller(fundedWallet);
        const [seller] = sellers;

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: seller.id
        });

        expect(funds).toBeTruthy();
        expect(funds.availableAmount).toBe(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );
        expect(funds.token.symbol.toUpperCase()).toBe("ETH");
      });

      test("ERC20", async () => {
        const sellerFundsDeposit = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
          seedWallet
        );
        const sellers = await ensureCreatedSeller(fundedWallet);
        const [seller] = sellers;

        await ensureMintedAndAllowedTokens([fundedWallet], sellerFundsDeposit);

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDeposit,
          sellerId: seller.id,
          fundsTokenAddress: MOCK_ERC20_ADDRESS
        });

        expect(funds).toBeTruthy();
        expect(funds.availableAmount).toBe(
          utils.parseEther(sellerFundsDeposit).toString()
        );
        expect(funds.token.symbol.toUpperCase()).toBe("20TEST");
      });
    });

    test("void offer", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );

      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      expect(createdOffer).toBeTruthy();
      expect(createdOffer.voided).toBe(false);

      const txResponse = await coreSDK.voidOffer(createdOffer.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();

      const offer = await coreSDK.getOfferById(createdOffer.id);
      expect(offer.voided).toBe(true);
    });

    test("commit (native currency offer)", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });

      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      expect(exchange).toBeTruthy();
    });

    test("Create a group for multiple offers", async () => {
      const tokenID = Date.now().toString();
      const { sellerCoreSDK, sellerWallet } = await initSellerAndBuyerSDKs(
        seedWallet
      );
      await ensureCreatedSeller(sellerWallet);

      // Create 3 offers
      const offer1 = await createOffer(sellerCoreSDK);
      const offer2 = await createOffer(sellerCoreSDK);
      const offer3 = await createOffer(sellerCoreSDK);

      // Ensure the condition token is minted
      await ensureMintedERC1155(sellerWallet, tokenID, "5");

      // Create the group for the 3 offers and the token condition
      const offerIds = [offer1.id, offer2.id, offer3.id];
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
      const createdGroupTx = await sellerCoreSDK.createGroup(groupToCreate);
      await createdGroupTx.wait();

      await waitForGraphNodeIndexing();

      // Check the 3 offers are linked to the condition in the SubGraph
      for (const offerId of offerIds) {
        const offerWithCondition = await sellerCoreSDK.getOfferById(offerId);
        const conditionClone = {
          ...offerWithCondition.condition
        };
        delete conditionClone.id;
        expect(offerWithCondition.condition).toBeTruthy();
        expect(conditionClone).toEqual(condition);
      }
    });

    test("createOfferWithCondition()", async () => {
      const tokenID = Date.now().toString();
      const { sellerCoreSDK, sellerWallet } = await initSellerAndBuyerSDKs(
        seedWallet
      );
      await ensureCreatedSeller(sellerWallet);

      // Ensure the condition token is minted
      await ensureMintedERC1155(sellerWallet, tokenID, "5");
      const condition = {
        method: EvaluationMethod.Threshold,
        tokenType: TokenType.MultiToken,
        tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
        tokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      // Create offer with condition
      const conditionDescription =
        "this offer requires to own at least one NFT of Makersplace collection: https://opensea.io/collection/makersplace";
      const offerWithCondition = await createOfferWithCondition(
        sellerCoreSDK,
        condition,
        {
          metadata: {
            condition: conditionDescription
          }
        }
      );
      // Check the condition is attached to the offer in Subgraph
      const conditionClone = {
        ...offerWithCondition.condition
      };
      delete conditionClone.id;
      expect(conditionClone).toEqual(condition);
      // Check the condition description is set in the metadata from the subgraph
      expect(offerWithCondition.metadata?.condition).toBeTruthy();
      expect(offerWithCondition.metadata?.condition).toEqual(
        conditionDescription
      );
    });

    test("createSellerAndOfferWithCondition()", async () => {
      const tokenID = Date.now().toString();
      const { sellerCoreSDK, sellerWallet } = await initSellerAndBuyerSDKs(
        seedWallet
      );

      // Ensure the condition token is minted
      await ensureMintedERC1155(sellerWallet, tokenID, "5");
      const condition = {
        method: EvaluationMethod.Threshold,
        tokenType: TokenType.MultiToken,
        tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
        tokenId: tokenID,
        threshold: "1",
        maxCommits: "3"
      };
      // Create offer with condition
      const conditionDescription =
        "this offer requires to own at least one NFT of Makersplace collection: https://opensea.io/collection/makersplace";
      const offerWithCondition = await createSellerAndOfferWithCondition(
        sellerCoreSDK,
        sellerWallet.address,
        condition,
        {
          metadata: {
            condition: conditionDescription
          }
        }
      );
      // Check the condition is attached to the offer in Subgraph
      const conditionClone = {
        ...offerWithCondition.condition
      };
      delete conditionClone.id;
      expect(conditionClone).toEqual(condition);
      // Check the condition description is set in the metadata from the subgraph
      expect(offerWithCondition.metadata?.condition).toBeTruthy();
      expect(offerWithCondition.metadata?.condition).toEqual(
        conditionDescription
      );
    });

    test.each(["ERC721", "ERC1155", "ERC20"])(
      `create an group on %p token and try to commit outside of that group`,
      async (token) => {
        const tokenID = Date.now().toString();
        const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const createdOffer = await createSellerAndOffer(
          sellerCoreSDK,
          sellerWallet.address
        );
        expect(createdOffer.condition).not.toBeTruthy();

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: createdOffer.seller.id
        });

        let groupToCreate;
        let condition;

        if (token === "ERC721") {
          await ensureMintedERC721(sellerWallet, tokenID);
          condition = {
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS.toLowerCase(),
            tokenId: tokenID,
            threshold: "0",
            maxCommits: "3"
          };
          groupToCreate = {
            offerIds: [createdOffer.id],
            ...condition
          };
        }
        if (token === "ERC1155") {
          await ensureMintedERC1155(sellerWallet, tokenID, "5");
          condition = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
            tokenId: tokenID,
            threshold: "1",
            maxCommits: "3"
          };
          groupToCreate = {
            offerIds: [createdOffer.id],
            ...condition
          };
        }
        if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([sellerWallet], "5");
          condition = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS.toLowerCase(),
            tokenId: tokenID,
            threshold: "1",
            maxCommits: "1"
          };
          groupToCreate = {
            offerIds: [createdOffer.id],
            ...condition
          };
        }

        const createdGroupTx = await sellerCoreSDK.createGroup(groupToCreate);

        await createdGroupTx.wait();

        await waitForGraphNodeIndexing();

        const offerWithCondition = await sellerCoreSDK.getOfferById(
          createdOffer.id
        );
        expect(offerWithCondition.condition).toBeTruthy();
        const conditionClone = {
          ...offerWithCondition.condition
        };
        delete conditionClone.id;
        expect(conditionClone).toEqual(condition);

        await expect(
          commitToOffer({
            buyerCoreSDK,
            sellerCoreSDK,
            offerId: createdOffer.id
          })
        ).rejects.toThrow(/Caller cannot commit/);
      }
    );

    test.each(["ERC721", "ERC1155", "ERC20"])(
      `create an group on %p token and buyer successfully commit to of that group`,
      async (token) => {
        const tokenId = Date.now().toString();
        const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const createdOffer = await createSellerAndOffer(
          sellerCoreSDK,
          sellerWallet.address
        );

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: createdOffer.seller.id
        });
        await depositFunds({
          coreSDK: buyerCoreSDK,
          sellerId: createdOffer.seller.id
        });

        let groupToCreate;

        if (token === "ERC721") {
          await ensureMintedERC721(buyerWallet, tokenId);
          groupToCreate = {
            offerIds: [createdOffer.id],
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "0",
            maxCommits: "3"
          };
        }
        if (token === "ERC1155") {
          await ensureMintedERC1155(buyerWallet, tokenId, "3");
          groupToCreate = {
            offerIds: [createdOffer.id],
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS,
            tokenId: tokenId,
            threshold: "3",
            maxCommits: "3"
          };
        }
        if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([buyerWallet], "5");
          groupToCreate = {
            offerIds: [createdOffer.id],
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS,
            tokenId: tokenId,
            threshold: "1",
            maxCommits: "1"
          };
        }

        const createdGroupTx = await sellerCoreSDK.createGroup(groupToCreate);

        await createdGroupTx.wait();

        const exchange = await commitToOffer({
          buyerCoreSDK,
          sellerCoreSDK,
          offerId: createdOffer.id
        });

        expect(exchange).toBeTruthy();
      }
    );

    test.each(["ERC721", "ERC1155", "ERC20"])(
      `create an offer with condition on %p and buyer can commit to it`,
      async (token) => {
        const tokenId = Date.now().toString();

        const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const seller = await createSeller(sellerCoreSDK, sellerWallet.address);

        const metadataHash = await sellerCoreSDK.storeMetadata({
          ...metadata,
          type: "BASE"
        });

        const metadataUri = "ipfs://" + metadataHash;

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: seller.id
        });

        let conditionToCreate;

        if (token === "ERC721") {
          await ensureMintedERC721(buyerWallet, tokenId);
          conditionToCreate = {
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "0",
            maxCommits: "3"
          };
        }
        if (token === "ERC1155") {
          await ensureMintedERC1155(buyerWallet, tokenId, "3");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS,
            tokenId: tokenId,
            threshold: "3",
            maxCommits: "3"
          };
        }
        if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([buyerWallet], "5");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS,
            tokenId: tokenId,
            threshold: "1",
            maxCommits: "1"
          };
        }

        const createOfferCondTx = await sellerCoreSDK.createOfferWithCondition(
          mockCreateOfferArgs({
            metadataHash,
            metadataUri
          }),
          conditionToCreate
        );

        const createOfferCond = await createOfferCondTx.wait();
        await waitForGraphNodeIndexing();

        const offerId = sellerCoreSDK.getCreatedOfferIdFromLogs(
          createOfferCond.logs
        );

        const exchange = await commitToOffer({
          buyerCoreSDK,
          sellerCoreSDK,
          offerId: offerId || "1"
        });

        expect(exchange).toBeTruthy();
      }
    );

    test.each(["ERC721", "ERC1155", "ERC20"])(
      `create an offer with condition on %p and buyer do not meet the conditions to commit`,
      async (token) => {
        const tokenId = Date.now().toString();

        const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const seller = await createSeller(sellerCoreSDK, sellerWallet.address);

        const metadataHash = await sellerCoreSDK.storeMetadata({
          ...metadata,
          type: "BASE"
        });

        const metadataUri = "ipfs://" + metadataHash;

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: seller.id
        });

        let conditionToCreate;

        if (token === "ERC721") {
          await ensureMintedERC721(sellerWallet, tokenId);
          conditionToCreate = {
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "0",
            maxCommits: "3"
          };
        }
        if (token === "ERC1155") {
          await ensureMintedERC1155(sellerWallet, tokenId, "3");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS,
            tokenId: tokenId,
            threshold: "3",
            maxCommits: "3"
          };
        }
        if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([sellerWallet], "5");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS,
            tokenId: tokenId,
            threshold: "1",
            maxCommits: "1"
          };
        }

        const createOfferCondTx = await sellerCoreSDK.createOfferWithCondition(
          mockCreateOfferArgs({
            metadataHash,
            metadataUri
          }),
          conditionToCreate
        );

        const createOfferCond = await createOfferCondTx.wait();
        await waitForGraphNodeIndexing();

        const offerId = sellerCoreSDK.getCreatedOfferIdFromLogs(
          createOfferCond.logs
        );

        await expect(
          commitToOffer({
            buyerCoreSDK,
            sellerCoreSDK,
            offerId: offerId || "1"
          })
        ).rejects.toThrow(/Caller cannot commit/);
      }
    );

    test.each(["ERC721-threshold", "ERC721-specific", "ERC1155", "ERC20"])(
      `create an offer with condition on %p and buyer meets the condition of that token gated`,
      async (token) => {
        const tokenId = Date.now().toString();

        const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const seller = await createSeller(sellerCoreSDK, sellerWallet.address);

        const metadataHash = await sellerCoreSDK.storeMetadata({
          ...metadata,
          type: "BASE"
        });

        const metadataUri = "ipfs://" + metadataHash;

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: seller.id
        });

        let conditionToCreate;

        if (token === "ERC721-threshold") {
          await ensureMintedERC721(buyerWallet, tokenId);
          const tokenId2 = Date.now().toString();
          await ensureMintedERC721(buyerWallet, tokenId2);
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "2",
            maxCommits: "3"
          };
        } else if (token === "ERC721-specific") {
          await ensureMintedERC721(buyerWallet, tokenId);
          conditionToCreate = {
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "0",
            maxCommits: "3"
          };
        } else if (token === "ERC1155") {
          await ensureMintedERC1155(buyerWallet, tokenId, "4");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS,
            tokenId: tokenId,
            threshold: "3",
            maxCommits: "3"
          };
        } else if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([buyerWallet], "5");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS,
            tokenId: tokenId,
            threshold: "1",
            maxCommits: "1"
          };
        }

        const createOfferCondTx = await sellerCoreSDK.createOfferWithCondition(
          mockCreateOfferArgs({
            metadataHash,
            metadataUri
          }),
          conditionToCreate
        );

        await createOfferCondTx.wait();
        await waitForGraphNodeIndexing();

        const buyerAddress = await buyerWallet.getAddress();
        const isMet = await buyerCoreSDK.checkTokenGatedCondition(
          conditionToCreate,
          buyerAddress
        );

        await expect(isMet).toBe(true);
      }
    );

    test.each(["ERC721-threshold", "ERC721-specific", "ERC1155", "ERC20"])(
      `create an offer with condition on %p and buyer does not meet the condition of that token gated`,
      async (token) => {
        const tokenId = Date.now().toString();

        const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
          await initSellerAndBuyerSDKs(seedWallet);

        const seller = await createSeller(sellerCoreSDK, sellerWallet.address);

        const metadataHash = await sellerCoreSDK.storeMetadata({
          ...metadata,
          type: "BASE"
        });

        const metadataUri = "ipfs://" + metadataHash;

        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: seller.id
        });

        let conditionToCreate;

        if (token === "ERC721-threshold") {
          await ensureMintedERC721(buyerWallet, tokenId);
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "2",
            maxCommits: "3"
          };
        } else if (token === "ERC721-specific") {
          await ensureMintedERC721(sellerWallet, tokenId);
          conditionToCreate = {
            method: EvaluationMethod.SpecificToken,
            tokenType: TokenType.NonFungibleToken,
            tokenAddress: MOCK_ERC721_ADDRESS,
            tokenId: tokenId,
            threshold: "0",
            maxCommits: "3"
          };
        } else if (token === "ERC1155") {
          await ensureMintedERC1155(buyerWallet, tokenId, "2");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS,
            tokenId: tokenId,
            threshold: "3",
            maxCommits: "3"
          };
        } else if (token === "ERC20") {
          await ensureMintedAndAllowedTokens([buyerWallet], "5");
          conditionToCreate = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.FungibleToken,
            tokenAddress: MOCK_ERC20_ADDRESS,
            tokenId: tokenId,
            threshold: "7000000000000000000",
            maxCommits: "1"
          };
        }

        const createOfferCondTx = await sellerCoreSDK.createOfferWithCondition(
          mockCreateOfferArgs({
            metadataHash,
            metadataUri
          }),
          conditionToCreate
        );

        await createOfferCondTx.wait();
        await waitForGraphNodeIndexing();

        const buyerAddress = await buyerWallet.getAddress();
        const isMet = await buyerCoreSDK.checkTokenGatedCondition(
          conditionToCreate,
          buyerAddress
        );

        await expect(isMet).toBe(false);
      }
    );

    test("commit (ERC20 currency offer)", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const sellerFundsDeposit = "5";
      const offerPrice = "10";
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address,
        {
          exchangeToken: MOCK_ERC20_ADDRESS,
          price: parseEther(offerPrice),
          sellerDeposit: parseEther(sellerFundsDeposit)
        }
      );
      await ensureMintedAndAllowedTokens([sellerWallet], sellerFundsDeposit);

      // Fund the seller in ERC20 token
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id,
        fundsDepositAmountInEth: sellerFundsDeposit,
        fundsTokenAddress: MOCK_ERC20_ADDRESS
      });

      // Fund the buyer in ERC20 token, but do not approve
      //  (as we expect commitToOffer to do it when required)
      await ensureMintedAndAllowedTokens([buyerWallet], offerPrice, false);

      // Check the allowance is not enough
      const allowance = await buyerCoreSDK.getProtocolAllowance(
        MOCK_ERC20_ADDRESS
      );
      expect(BigNumber.from(allowance).lt(createdOffer.price)).toBe(true);

      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      expect(exchange).toBeTruthy();
    });

    test("revoke", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await sellerCoreSDK.revokeVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await sellerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Revoked);
      expect(exchangeAfterRevoke.revokedDate).toBeTruthy();
    });

    test("cancel", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.cancelVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Cancelled);
      expect(exchangeAfterRevoke.cancelledDate).toBeTruthy();
    });

    test("redeem + finalize", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.redeemVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Redeemed);
      expect(exchangeAfterRevoke.redeemedDate).toBeTruthy();

      const exchangeAfterComplete = await completeExchange({
        coreSDK: buyerCoreSDK,
        exchangeId: exchange.id
      });

      expect(exchangeAfterComplete.state).toBe(ExchangeState.Completed);
      expect(exchangeAfterComplete.completedDate).toBeTruthy();
    });

    test("redeem + finalize batch", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange1 = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });
      const exchange2 = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse1 = await buyerCoreSDK.redeemVoucher(exchange1.id);
      await txResponse1.wait();
      const txResponse2 = await buyerCoreSDK.redeemVoucher(exchange2.id);
      await txResponse2.wait();

      const exchangesAfterComplete = await completeExchangeBatch({
        coreSDK: buyerCoreSDK,
        exchangeIds: [exchange1.id, exchange2.id]
      });
      await waitForGraphNodeIndexing();

      expect(exchangesAfterComplete[0].state).toBe(ExchangeState.Completed);
      expect(exchangesAfterComplete[0].completedDate).toBeTruthy();
      expect(exchangesAfterComplete[1].state).toBe(ExchangeState.Completed);
      expect(exchangesAfterComplete[1].completedDate).toBeTruthy();
    });

    describe("withdraw funds", () => {
      test("ETH", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
          seedWallet
        );
        const sellers = await ensureCreatedSeller(fundedWallet);
        const [seller] = sellers;

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: seller.id
        });
        expect(funds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        const tokenAddress = funds.token.address;

        const updatedFunds = await withdrawFunds({
          coreSDK,
          sellerId: seller.id,
          tokenAddresses: [tokenAddress],
          amountsInEth: [sellerFundsDepositInEth]
        });

        expect(updatedFunds[0].availableAmount).toEqual("0");
      });

      test("ETH and ERC20", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
          seedWallet
        );
        const sellers = await ensureCreatedSeller(fundedWallet);
        const [seller] = sellers;

        const ethFunds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: seller.id,
          fundsTokenAddress: constants.AddressZero
        });
        expect(ethFunds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        await ensureMintedAndAllowedTokens(
          [fundedWallet],
          sellerFundsDepositInEth
        );

        const mockErc20Funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: seller.id,
          fundsTokenAddress: MOCK_ERC20_ADDRESS
        });

        expect(mockErc20Funds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        const updatedFunds = await withdrawFunds({
          coreSDK,
          sellerId: seller.id,
          tokenAddresses: [constants.AddressZero, MOCK_ERC20_ADDRESS],
          amountsInEth: [sellerFundsDepositInEth, sellerFundsDepositInEth]
        });

        const ethFundsAvailable = updatedFunds.find(
          (fund) => fund.token.address === constants.AddressZero
        )?.availableAmount;
        const mockErc20FundsAvailable = updatedFunds.find(
          (fund) =>
            fund.token.address.toLowerCase() ===
            MOCK_ERC20_ADDRESS.toLowerCase()
        )?.availableAmount;
        expect(ethFundsAvailable).toEqual("0");
        expect(mockErc20FundsAvailable).toEqual("0");
      });
    });

    describe("disputes", () => {
      let exchange: ExchangeFieldsFragment;
      const sellerWallet = sellerWallet2;
      const buyerWallet = buyerWallet2;
      const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
      const buyerCoreSDK = initCoreSDKWithWallet(buyerWallet);

      beforeEach(async () => {
        await waitForGraphNodeIndexing();
        await ensureCreatedSeller(sellerWallet);

        // before each case, create offer + commit + redeem
        const createdOffer = await createOffer(sellerCoreSDK);
        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: createdOffer.seller.id
        });
        exchange = await commitToOffer({
          buyerCoreSDK,
          sellerCoreSDK,
          offerId: createdOffer.id
        });

        const txResponse = await buyerCoreSDK.redeemVoucher(exchange.id);
        await txResponse.wait();
        await waitForGraphNodeIndexing();
      });

      test("raise dispute", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        await checkDisputeResolving(exchange.id, buyerCoreSDK);
      });

      test("raise dispute + retract", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Retract the dispute
        await retractDispute(exchange.id, buyerCoreSDK);

        await checkDisputeRetracted(exchange.id, buyerCoreSDK);
      });

      test("expired dispute", async () => {
        // create another offer with very small resolutionPeriod + commit + redeem
        await ensureCreatedSeller(sellerWallet);

        const createdOffer = await createOffer(sellerCoreSDK, {
          resolutionPeriodDurationInMS: 1000
        });
        await depositFunds({
          coreSDK: sellerCoreSDK,
          sellerId: createdOffer.seller.id
        });
        exchange = await commitToOffer({
          buyerCoreSDK,
          sellerCoreSDK,
          offerId: createdOffer.id
        });

        const txResponse = await buyerCoreSDK.redeemVoucher(exchange.id);
        await txResponse.wait();
        await waitForGraphNodeIndexing();

        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        await checkDisputeResolving(exchange.id, buyerCoreSDK);

        // Expire the dispute
        await expireDispute(exchange.id, sellerCoreSDK);

        await checkDisputeRetracted(exchange.id, buyerCoreSDK);
      });

      test("raise dispute + resolve (from buyer)", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Resolve the dispute from buyer
        const buyerPercent = "4400"; // 44%

        await resolveDispute(
          exchange.id,
          buyerPercent,
          buyerCoreSDK,
          sellerCoreSDK
        );

        await checkDisputeResolved(exchange.id, buyerPercent, buyerCoreSDK);
      });

      test("raise dispute + resolve (from seller)", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Resolve the dispute from seller
        const buyerPercent = "4321"; // 43.21%

        await resolveDispute(
          exchange.id,
          buyerPercent,
          sellerCoreSDK,
          buyerCoreSDK
        );

        await checkDisputeResolved(exchange.id, buyerPercent, sellerCoreSDK);
      });

      test("raise dispute + extend", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        const disputeTimeout = await getDisputeTimeout(
          exchange.id,
          buyerCoreSDK
        );

        const newTimeout = BigNumber.from(disputeTimeout).add(12).toString();

        // Seller extends the dispute timeout
        await extendDisputeTimeout(exchange.id, newTimeout, sellerCoreSDK);

        await checkDisputeResolving(exchange.id, sellerCoreSDK);

        await checkDisputeTimeout(exchange.id, newTimeout, sellerCoreSDK);
      });

      test("raise dispute + escalate", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Escalate the dispute
        await escalateDispute(exchange.id, buyerCoreSDK);

        await checkDisputeEscalated(exchange.id, buyerCoreSDK);
      });

      test("raise dispute + escalate + decide", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Escalate the dispute
        await escalateDispute(exchange.id, buyerCoreSDK);

        // Decide the dispute from DR
        const buyerPercent = "4321"; // 43.21%

        // Create the SDK for DR account
        const drCoreSDK = initCoreSDKWithWallet(drWallet);

        // DR decides the dispute result
        await decideDispute(exchange.id, buyerPercent, drCoreSDK);

        await checkDisputeDecided(exchange.id, buyerPercent, drCoreSDK);
      });

      test("raise dispute + escalate + refuse", async () => {
        // Raise the dispute
        await raiseDispute(exchange.id, buyerCoreSDK);

        // Escalate the dispute
        await escalateDispute(exchange.id, buyerCoreSDK);

        // Create the SDK for DR account
        const drCoreSDK = initCoreSDKWithWallet(drWallet);

        // DR refuses the dispute
        await refuseDispute(exchange.id, drCoreSDK);

        await checkDisputeRefused(exchange.id, drCoreSDK);
      });

      xtest("raise dispute + escalate + expire", async () => {
        // This test case would require a specific dispute resolver created with a very small escalationResponsePeriod
      });
    });
  });

  describe("getSellerByAddress()", () => {
    test("getSellerByAddress() retrieve the seller using the address", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );

      const seller = await createSeller(coreSDK, fundedWallet.address);
      expect(seller).toBeTruthy();

      const sellerId = seller.id;

      const sellers2 = await coreSDK.getSellersByAddress(fundedWallet.address);
      const [seller2] = sellers2;
      expect(seller2).toBeTruthy();
      expect(seller2.id).toEqual(sellerId);
    });
  });
});

async function checkDisputeResolver(
  coreSDK: CoreSDK,
  sellerId: BigNumberish,
  disputeResolverId: BigNumberish
) {
  // Check the disputeResolver exists and is active
  const dr = await coreSDK.getDisputeResolverById(disputeResolverId);
  expect(dr).toBeTruthy();
  expect(dr.active).toBe(true);
  expect(
    dr.sellerAllowList.length == 0 ||
      dr.sellerAllowList.indexOf(sellerId.toString()) >= 0
  ).toBe(true);
}

async function depositFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  fundsDepositAmountInEth?: string;
  fundsTokenAddress?: string;
}): Promise<FundsEntityFieldsFragment> {
  const tokenAddress = args.fundsTokenAddress ?? constants.AddressZero;
  const depositFundsTxResponse = await args.coreSDK.depositFunds(
    args.sellerId,
    utils.parseEther(args.fundsDepositAmountInEth || "5"),
    tokenAddress
  );
  await depositFundsTxResponse.wait();

  await waitForGraphNodeIndexing();

  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId
    }
  });

  const depositedFunds = funds.find(
    (x) => x.token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  if (!depositedFunds) throw new Error(`No funds found for ${tokenAddress}`);

  return depositedFunds;
}

async function withdrawFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  tokenAddresses: Array<string>;
  amountsInEth: Array<string>;
}): Promise<Array<FundsEntityFieldsFragment>> {
  const withdrawResponse = await args.coreSDK.withdrawFunds(
    args.sellerId,
    args.tokenAddresses,
    args.amountsInEth.map((amount) => utils.parseEther(amount))
  );
  await withdrawResponse.wait();
  await waitForGraphNodeIndexing();

  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId
    }
  });

  return funds;
}

async function commitToOffer(args: {
  buyerCoreSDK: CoreSDK;
  sellerCoreSDK: CoreSDK;
  offerId: BigNumberish;
}) {
  const commitToOfferTxResponse = await args.buyerCoreSDK.commitToOffer(
    args.offerId
  );
  const commitToOfferTxReceipt = await commitToOfferTxResponse.wait();
  const exchangeId = args.buyerCoreSDK.getCommittedExchangeIdFromLogs(
    commitToOfferTxReceipt.logs
  );
  await waitForGraphNodeIndexing();
  const exchange = await args.sellerCoreSDK.getExchangeById(
    exchangeId as string
  );
  return exchange;
}

async function completeExchange(args: {
  coreSDK: CoreSDK;
  exchangeId: BigNumberish;
}) {
  const completeExchangeTxResponse = await args.coreSDK.completeExchange(
    args.exchangeId
  );
  await completeExchangeTxResponse.wait();
  await waitForGraphNodeIndexing();
  const exchangeAfterComplete = await args.coreSDK.getExchangeById(
    args.exchangeId
  );
  return exchangeAfterComplete;
}

async function completeExchangeBatch(args: {
  coreSDK: CoreSDK;
  exchangeIds: BigNumberish[];
}) {
  const completeExchangeTxResponse = await args.coreSDK.completeExchangeBatch(
    args.exchangeIds
  );
  await completeExchangeTxResponse.wait();
  await waitForGraphNodeIndexing();
  const exchangesAfterComplete = await args.coreSDK.getExchanges({
    exchangesFilter: {
      id_in: args.exchangeIds.map((id) => id.toString())
    }
  });
  return exchangesAfterComplete;
}

async function raiseDispute(exchangeId: string, buyerCoreSDK: CoreSDK) {
  const exchangeAfterRedeem = await buyerCoreSDK.getExchangeById(exchangeId);
  expect(exchangeAfterRedeem.state).toBe(ExchangeState.Redeemed);
  expect(exchangeAfterRedeem.disputed).toBeFalsy();

  const dispute = await buyerCoreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeNull();

  const txResponse = await buyerCoreSDK.raiseDispute(exchangeId);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
  const exchangeAfterDispute = await buyerCoreSDK.getExchangeById(exchangeId);
  expect(exchangeAfterDispute.state).toBe(ExchangeState.Disputed);
  expect(exchangeAfterDispute.completedDate).toBeNull();
  expect(exchangeAfterDispute.finalizedDate).toBeNull();

  expect(exchangeAfterDispute.disputedDate).toBeTruthy();
  expect(exchangeAfterDispute.disputed).toBeTruthy();
}

async function checkDisputeResolving(exchangeId: string, coreSDK: CoreSDK) {
  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now RESOLVING
  expect(dispute.state).toBe(DisputeState.Resolving);

  // dispute date is correct
  expect(dispute.disputedDate).toBeTruthy();

  // dispute exchange is correct
  expect(dispute.exchange.id).toEqual(exchangeId);
  expect(dispute.exchangeId.toString()).toEqual(exchangeId);

  // dispute finalizedDate is not set
  expect(dispute.finalizedDate).toBeNull();
}

async function retractDispute(exchangeId: string, buyerCoreSDK: CoreSDK) {
  const txResponse = await buyerCoreSDK.retractDispute(exchangeId);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}

async function checkDisputeRetracted(exchangeId: string, coreSDK: CoreSDK) {
  const exchangeAfterRetract = await coreSDK.getExchangeById(exchangeId);

  // exchange state is still DISPUTED
  expect(exchangeAfterRetract.disputed).toBeTruthy();
  expect(exchangeAfterRetract.state).toBe(ExchangeState.Disputed);

  // exchange finalizedDate is filled
  expect(exchangeAfterRetract.finalizedDate).toBeTruthy();

  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now RETRACTED
  expect(dispute.state).toBe(DisputeState.Retracted);

  // dispute buyerPercent is 0
  expect(dispute.buyerPercent).toEqual("0");

  // dispute finalizedDate is correct
  expect(dispute.finalizedDate).toBeTruthy();
  expect(dispute.retractedDate).toBeTruthy();
}

async function resolveDispute(
  exchangeId: string,
  buyerPercentBasisPoints: string,
  resolverSDK: CoreSDK,
  signerSDK: CoreSDK
) {
  {
    // sign the message from seller
    const {
      r: sigR,
      s: sigS,
      v: sigV
    } = await signerSDK.signDisputeResolutionProposal({
      exchangeId,
      buyerPercentBasisPoints
    });

    // send the Resolve transaction from buyer
    const txResponse = await resolverSDK.resolveDispute({
      exchangeId: exchangeId,
      buyerPercentBasisPoints,
      sigR,
      sigS,
      sigV
    });
    await txResponse.wait();
    await waitForGraphNodeIndexing();
  }
}

async function checkDisputeResolved(
  exchangeId: string,
  buyerPercent: string,
  coreSDK: CoreSDK
) {
  const exchangeAfterResolve = await coreSDK.getExchangeById(exchangeId);

  // exchange state is still DISPUTED
  expect(exchangeAfterResolve.disputed).toBeTruthy();
  expect(exchangeAfterResolve.state).toBe(ExchangeState.Disputed);

  // exchange finalizedDate is filled
  expect(exchangeAfterResolve.finalizedDate).toBeTruthy();

  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now RESOLVED
  expect(dispute.state).toBe(DisputeState.Resolved);

  // dispute buyerPercent is the one specified
  expect(dispute.buyerPercent).toEqual(buyerPercent);

  // dispute finalizedDate is correct
  expect(dispute.finalizedDate).toBeTruthy();
  expect(dispute.resolvedDate).toBeTruthy();
}

async function escalateDispute(exchangeId: string, buyerCoreSDK: CoreSDK) {
  const txResponse = await buyerCoreSDK.escalateDispute(exchangeId);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}

async function checkDisputeEscalated(exchangeId: string, coreSDK: CoreSDK) {
  const exchangeAfterEscalate = await coreSDK.getExchangeById(exchangeId);

  // exchange state is still DISPUTED
  expect(exchangeAfterEscalate.disputed).toBeTruthy();
  expect(exchangeAfterEscalate.state).toBe(ExchangeState.Disputed);

  // exchange finalizedDate is still null
  expect(exchangeAfterEscalate.finalizedDate).toBeNull();

  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now ESCALATED
  expect(dispute.state).toBe(DisputeState.Escalated);

  // dispute finalizedDate is null
  expect(dispute.finalizedDate).toBeNull();

  // dispute escalatedDate is now filled
  expect(dispute.escalatedDate).toBeTruthy();
}

async function getDisputeTimeout(exchangeId: string, coreSDK: CoreSDK) {
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  return dispute.timeout;
}

async function decideDispute(
  exchangeId: string,
  buyerPercent: string,
  drCoreSDK: CoreSDK
) {
  const txResponse = await drCoreSDK.decideDispute(exchangeId, buyerPercent);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}

async function checkDisputeDecided(
  exchangeId: string,
  buyerPercent: string,
  coreSDK: CoreSDK
) {
  const exchangeAfterDecide = await coreSDK.getExchangeById(exchangeId);

  // exchange state is still DISPUTED
  expect(exchangeAfterDecide.disputed).toBeTruthy();
  expect(exchangeAfterDecide.state).toBe(ExchangeState.Disputed);

  // exchange finalizedDate is filled
  expect(exchangeAfterDecide.finalizedDate).toBeTruthy();

  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now DECIDED
  expect(dispute.state).toBe(DisputeState.Decided);

  // dispute finalizedDate is filled
  expect(dispute.finalizedDate).toBeTruthy();
  expect(dispute.decidedDate).toBeTruthy();

  // dispute buyerPercent is filled
  expect(dispute.buyerPercent).toEqual(buyerPercent);
}

async function extendDisputeTimeout(
  exchangeId: string,
  newTimeout: string,
  sellerCoreSDK: CoreSDK
) {
  const txResponse = await sellerCoreSDK.extendDisputeTimeout(
    exchangeId,
    newTimeout
  );
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}

async function checkDisputeTimeout(
  exchangeId: string,
  expectedTimeout: string,
  coreSDK: CoreSDK
) {
  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute timeout has been increased
  expect(BigNumber.from(dispute.timeout).eq(expectedTimeout)).toBe(true);
}

async function refuseDispute(exchangeId: string, drCoreSDK: CoreSDK) {
  const txResponse = await drCoreSDK.refuseEscalatedDispute(exchangeId);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}

async function checkDisputeRefused(exchangeId: string, coreSDK: CoreSDK) {
  const exchangeAfterDecide = await coreSDK.getExchangeById(exchangeId);

  // exchange state is still DISPUTED
  expect(exchangeAfterDecide.disputed).toBeTruthy();
  expect(exchangeAfterDecide.state).toBe(ExchangeState.Disputed);

  // exchange finalizedDate is filled
  expect(exchangeAfterDecide.finalizedDate).toBeTruthy();

  // Retrieve the dispute from the data model
  const dispute = await coreSDK.getDisputeById(exchangeId);
  expect(dispute).toBeTruthy();

  // dispute state is now REFUSED
  expect(dispute.state).toBe(DisputeState.Refused);

  // dispute finalizedDate is filled
  expect(dispute.finalizedDate).toBeTruthy();
  expect(dispute.refusedDate).toBeTruthy();

  // dispute buyerPercent is filled
  expect(dispute.buyerPercent).toEqual("0");
}

async function expireDispute(exchangeId: string, coreSDK: CoreSDK) {
  const txResponse = await coreSDK.expireDispute(exchangeId);
  await txResponse.wait();
  await waitForGraphNodeIndexing();
}
