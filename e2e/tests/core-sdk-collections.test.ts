import { SellerFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import {
  createSeller,
  initCoreSDKWithFundedWallet,
  seedWallet20,
  updateSeller
} from "./utils";

jest.setTimeout(60_000);

describe("Offer collections", () => {
  let seller1: SellerFieldsFragment;
  let coreSDK_A, coreSDK_B;
  let wallet_A, wallet_B;
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
    // TODO: check a collection with random id has been created
  });
  test("Create a seller with a specific collection Id", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: { collectionId: customCollectionId }
    });
    expect(seller).toBeTruthy();
    // TODO: check a collection with the specified id has been created
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
    // TODO: check another collection with custom id has been created
  });
  test("Check a seller can't create another collection with an existing collectionId", async () => {
    const { coreSDK: coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet20);
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: { collectionId: customCollectionId }
    });
    expect(seller).toBeTruthy();
    // TODO: check the collection already exists
    await expect(
      coreSDK.createNewCollection({
        contractUri: "",
        royaltyPercentage: 0,
        collectionId: customCollectionId
      })
    ).rejects.toThrow(/Clone creation failed/);
  });
  test("Check collection metadata", async () => {
    // TODO:
  });
  test("Check create offer in default collection", async () => {
    // TODO:
  });
  test("Check create offer in another collection", async () => {
    // TODO:
  });
  test("Check create offer in a not existing collection", async () => {
    // TODO:
  });
});
