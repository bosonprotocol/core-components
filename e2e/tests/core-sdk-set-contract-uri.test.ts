import { BigNumber, Wallet } from "ethers";
import { CoreSDK } from "../../packages/core-sdk/src";

import {
  createOffer,
  createSellerAndOffer,
  ensureCreatedSeller,
  initCoreSDKWithFundedWallet,
  seedWallet18,
  waitForGraphNodeIndexing
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet18; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-set-contract-uri", () => {
  test.only("Set contract URI", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const newContractURI = "ipfs://testNewContractURI";
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );

    expect(createdOffer).toBeTruthy();
    expect(createdOffer.seller).toBeTruthy();
    expect(createdOffer.seller.contractURI).not.toBe(newContractURI);

    const tx = await coreSDK.setContractURI(newContractURI);
    await tx.wait();

    await waitForGraphNodeIndexing();
    const sellerWithNewContractURI = await coreSDK.getSellerById(
      createdOffer.seller.id
    );
    expect(sellerWithNewContractURI.contractURI).toEqual(newContractURI);
  });
});
