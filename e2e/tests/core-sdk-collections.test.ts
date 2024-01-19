import { CoreSDK } from "../../packages/core-sdk/src";
import { SellerFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import {
  createOffer,
  createSeller,
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  publishNftContractMetadata,
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
  const collectionMetadata1 = {
    schemaUrl: "schema-url.com",
    type: "COLLECTION",
    name: "MyCollection",
    description: "This is my collection",
    image:
      "https://upload.wikimedia.org/wikipedia/en/c/c4/Various_Bored_Ape.jpg",
    external_link: "www.mycollection.com",
    collaborators: [
      "Doc",
      "Grumpy",
      "Happy",
      "Sleepy",
      "Bashful",
      "Sneezy",
      "Dopey"
    ]
  };
  const collectionMetadata2 = {
    schemaUrl: "schema-url.com",
    type: "COLLECTION",
    name: "MyCollection2",
    description: "This is my 2nd collection",
    image:
      "https://en.wikipedia.org/wiki/Walt_Disney#/media/File:Steamboat-willie.jpg",
    external_link: "www.mycollection2.com",
    collaborators: ["Alice", "Bob", "Charlie"]
  };
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
    await waitForGraphNodeIndexing(tx);
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
    await waitForGraphNodeIndexing(tx);
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
  test("Create a collection with max length ID (31 char)", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    const maxLengthId = "x".repeat(31);
    expect(seller).toBeTruthy();
    const tx = await coreSDK.createNewCollection({
      contractUri: "",
      royaltyPercentage: 0,
      collectionId: maxLengthId
    });
    await tx.wait();
    await waitForGraphNodeIndexing(tx);
    const collections = await coreSDK_A.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(2);
    expect(collections[1].externalId).toEqual(maxLengthId);
  });
  test("Create a collection with a ID too long (>31 char)", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    await expect(
      coreSDK.createNewCollection({
        contractUri: "",
        royaltyPercentage: 0,
        collectionId: "x".repeat(32)
      })
    ).rejects.toThrow(`collectionId length should not exceed 31 characters`);
  });
  test("Check collection metadata for initial collection", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const collectionMetadata1Uri = await publishNftContractMetadata(
      coreSDK,
      collectionMetadata1
    );
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: { contractUri: collectionMetadata1Uri }
    });
    expect(seller).toBeTruthy();
    expect(seller.collections.length).toEqual(1);
    expect(seller.collections[0].metadata).toBeTruthy();
    expect(seller.collections[0].metadata.name).toEqual(
      collectionMetadata1.name
    );
    expect(seller.collections[0].metadata.externalLink).toEqual(
      collectionMetadata1.external_link
    );
    expect(seller.collections[0].metadata.collaborators.length).toEqual(
      collectionMetadata1.collaborators.length
    );
  });
  test("Check collection metadata for an additional collection", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const collectionMetadata2Uri = await publishNftContractMetadata(
      coreSDK,
      collectionMetadata2
    );
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    const tx = await coreSDK.createNewCollection({
      contractUri: collectionMetadata2Uri,
      royaltyPercentage: 0,
      collectionId: collectionMetadata2.name
    });
    await tx.wait();
    await waitForGraphNodeIndexing(tx);
    const collections = await coreSDK.getOfferCollections({
      offerCollectionsFilter: {
        sellerId: seller.id
      }
    });
    expect(collections.length).toEqual(2);
    expect(collections[1].externalId).toEqual(collectionMetadata2.name);
    expect(collections[1].metadata).toBeTruthy();
    expect(collections[1].metadata?.name).toEqual(collectionMetadata2.name);
    expect(collections[1].metadata?.externalLink).toEqual(
      collectionMetadata2.external_link
    );
    expect(collections[1].metadata?.collaborators?.length).toEqual(
      collectionMetadata2.collaborators.length
    );
  });
  test("Check incomplete collection metadata", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const collectionMetadataUri = await publishNftContractMetadata(coreSDK, {
      schemaUrl: "schema-url.com",
      type: "COLLECTION"
      // no other fields
    });
    await expect(
      createSeller(coreSDK, fundedWallet.address, {
        sellerParams: { contractUri: collectionMetadataUri }
      })
    ).rejects.toThrow("name is a required field");
  });
  test("Check invalid collection metadata", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const collectionMetadataUri = await publishNftContractMetadata(coreSDK, {
      type: "INVALID",
      name: "MyCollection"
    });
    await expect(
      createSeller(coreSDK, fundedWallet.address, {
        sellerParams: { contractUri: collectionMetadataUri }
      })
    ).rejects.toThrow("Metadata validation failed for unknown type: INVALID");
  });
  test("Check non existing collection metadata file", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const collectionMetadata1Uri = await publishNftContractMetadata(
      coreSDK,
      collectionMetadata1
    );
    await expect(
      createSeller(coreSDK, fundedWallet.address, {
        sellerParams: {
          contractUri: collectionMetadata1Uri + "x" // tamper the IPFS link
        }
      })
    ).rejects.toThrow();
  });
});
