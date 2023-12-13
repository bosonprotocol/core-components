import { CoreSDK } from "../../packages/core-sdk/src";
import { SellerFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import {
  createOffer,
  createSeller,
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet20,
  updateSeller,
  waitForGraphNodeIndexing
} from "./utils";
import { Wallet } from "ethers";

jest.setTimeout(60_000);

describe("Offer collections", () => {
  let seller1: SellerFieldsFragment;
  let coreSDK_A: CoreSDK, coreSDK_B: CoreSDK;
  let wallet_A: Wallet, wallet_B: Wallet;
  const customCollectionId = "summer-2024-collection";
  beforeEach(async () => {
    // Create seller1 with wallet_A, then update all roles to wallet_B address,
    // so that wallet_A can now be reused for another seller account
    ({ coreSDK: coreSDK_A, fundedWallet: wallet_A } =
      await initCoreSDKWithFundedWallet(seedWallet20));
    ({ coreSDK: coreSDK_B, fundedWallet: wallet_B } =
      await initCoreSDKWithFundedWallet(seedWallet20));
    seller1 = await createSeller(coreSDK_A, wallet_A.address);
    expect(seller1).toBeTruthy();
    seller1 = await updateSeller(
      coreSDK_A,
      seller1,
      {
        assistant: wallet_B.address,
        admin: wallet_B.address,
        treasury: wallet_B.address
      },
      [
        {
          coreSDK: coreSDK_B,
          fieldsToUpdate: {
            assistant: true,
            admin: true
          }
        }
      ]
    );
    expect(seller1.assistant.toLowerCase()).toEqual(
      wallet_B.address.toLowerCase()
    );
    expect(seller1.admin.toLowerCase()).toEqual(wallet_B.address.toLowerCase());
    expect(seller1.treasury.toLowerCase()).toEqual(
      wallet_B.address.toLowerCase()
    );
  });
  test("Create another seller with a wallet previously assigned in the past", async () => {
    const seller2 = await createSeller(coreSDK_A, wallet_A.address);
    expect(seller2).toBeTruthy();
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller2.id
      }
    });
    expect(collections.length).toEqual(1);
    expect(collections[0].collectionIndex).toEqual("0");
    expect(collections[0].externalId).toEqual("initial");
  });
  test("Check a seller can create another collection with a custom collectionId", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    const tx = await coreSDK.createNewCollection({
      contractUri: "",
      royaltyPercentage: 0,
      collectionId: customCollectionId
    });
    await tx.wait();
    await waitForGraphNodeIndexing();
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(2);
    expect(collections[1].collectionIndex).toEqual("1");
    expect(collections[1].externalId).toEqual(customCollectionId);
  });
  test("Check the collection list at seller level", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    expect(seller.collections.length).toEqual(1);
    const tx = await coreSDK.createNewCollection({
      contractUri: "",
      royaltyPercentage: 0,
      collectionId: customCollectionId
    });
    await tx.wait();
    await waitForGraphNodeIndexing();
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(2);
    expect(collections[1].collectionIndex).toEqual("1");
    expect(collections[1].externalId).toEqual(customCollectionId);
    const sellerUpdate = await coreSDK.getSellerById(seller.id);
    expect(sellerUpdate).toBeTruthy();
    expect(sellerUpdate.collections.length).toEqual(2);
    expect(sellerUpdate.collections[1].collectionIndex).toEqual("1");
    expect(sellerUpdate.collections[1].externalId).toEqual(customCollectionId);
  });
  test("Check a seller can't create another collection with an existing collectionId", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(1);
    const exisitingCollectionId = collections[0].externalId;
    await expect(
      coreSDK.createNewCollection({
        contractUri: "",
        royaltyPercentage: 0,
        collectionId: exisitingCollectionId
      })
    ).rejects.toThrow(
      `CollectionId '${exisitingCollectionId}' is not available for seller '${seller.id}'`
    );
  });
  test("Check create offer in default collection", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet20
    );
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: createdOffer.seller.id
      }
    });
    expect(collections.length).toEqual(1);
    expect(createdOffer).toBeTruthy();
    expect(createdOffer.collectionIndex).toEqual("0");
    expect(createdOffer.collection).toBeTruthy();
    expect(createdOffer.collection.id).toEqual(collections[0].id);
  });
  test("Check create offer in another collection", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    const tx = await coreSDK.createNewCollection({
      contractUri: "",
      royaltyPercentage: 0,
      collectionId: customCollectionId
    });
    await tx.wait();
    const collectionIndex = 1;
    const createdOffer = await createOffer(coreSDK, { collectionIndex });
    expect(createdOffer).toBeTruthy();
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(2);
    expect(createdOffer.collectionIndex).toEqual(collectionIndex.toString());
    expect(createdOffer.collection).toBeTruthy();
    expect(createdOffer.collection.id).toEqual(collections[collectionIndex].id);
  });
  test("Check create offer in a not existing collection", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    const tx = await coreSDK.createNewCollection({
      contractUri: "",
      royaltyPercentage: 0,
      collectionId: customCollectionId
    });
    await tx.wait();
    const collectionIndex = 2;
    await expect(createOffer(coreSDK, { collectionIndex })).rejects.toThrow(
      `No such collection`
    );
  });
  test("Create a collection with a ID too long (>32 char)", async () => {
    // TODO: ensure the length of the collectionId is checked before being submitted to the blockchain
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    await expect(
      coreSDK.createNewCollection({
        contractUri: "",
        royaltyPercentage: 0,
        collectionId: "0".repeat(33)
      })
    ).rejects.toThrow(`bytes32 string must be less than 32 bytes`);
  });
  test("Check collection metadata", async () => {
    // TODO:
  });
});
