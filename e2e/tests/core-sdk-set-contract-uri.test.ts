import {
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  seedWallet18
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet18; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-set-contract-uri", () => {
  test("Set contract URI", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const newContractURI = "ipfs://testNewContractURI";
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();
    const seller = await coreSDK.getSellerById(createdOffer.seller.id);
    expect(seller.collections.length).toEqual(1);
    expect(seller.collections[0].collectionContract.contractUri).not.toEqual(
      newContractURI
    );

    const collectionIndex = 0;
    const tx = await coreSDK.setContractURI(newContractURI, collectionIndex);
    await tx.wait();

    await coreSDK.waitForGraphNodeIndexing(tx);
    const sellerWithNewContractURI = await coreSDK.getSellerById(
      createdOffer.seller.id
    );
    expect(
      sellerWithNewContractURI.collections[0].collectionContract.contractUri
    ).toEqual(newContractURI);
  });

  test("Set contract URI - Not existing seller", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const [seller] = await coreSDK.getSellersByAddress(fundedWallet.address);
    expect(seller).not.toBeTruthy();

    const newContractURI = "ipfs://testNewContractURI";
    const collectionIndex = 0;
    await expect(
      coreSDK.setContractURI(newContractURI, collectionIndex)
    ).rejects.toThrow(/No seller found for wallet/);
  });

  test("Set contract URI - Not existing collection", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
    const newContractURI = "ipfs://testNewContractURI";
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();
    const seller = await coreSDK.getSellerById(createdOffer.seller.id);
    expect(seller.collections.length).toEqual(1);
    expect(seller.collections[0].collectionContract.contractUri).not.toEqual(
      newContractURI
    );

    const collectionIndex = 1;
    await expect(
      coreSDK.setContractURI(newContractURI, collectionIndex)
    ).rejects.toThrow(
      `Collection with index ${collectionIndex} not found for seller with id ${seller.id}`
    );
  });
});
