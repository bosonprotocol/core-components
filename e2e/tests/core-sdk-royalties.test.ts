import { Wallet, BigNumber } from "ethers";
import { ZERO_ADDRESS } from "../../packages/core-sdk/tests/mocks";
import {
  createSeller,
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  seedWallet23,
  waitForGraphNodeIndexing
} from "./utils";

const seedWallet = seedWallet23; // be sure the seedWallet is not used by another test (to allow concurrent run)

jest.setTimeout(60_000);

describe("Seller royalties recipients", () => {
  let maxRoyaltyPercentage;
  beforeAll(async () => {
    const coreSDK = initCoreSDKWithWallet(Wallet.createRandom());
    maxRoyaltyPercentage = await coreSDK.getMaxRoyaltyPercentage();
  })
  test("default royalties for a seller", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1);
    expect(seller.royaltyRecipients[0].wallet).toEqual(ZERO_ADDRESS);
    expect(seller.royaltyRecipients[0].minRoyaltyPercentage).toEqual("0");
  });
  test("custom royalties for a seller - non-zero percentage for treasury", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage)
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1);
    expect(seller.royaltyRecipients[0].wallet).toEqual(ZERO_ADDRESS);
    expect(seller.royaltyRecipients[0].minRoyaltyPercentage).toEqual(treasuryPercentage);
  });
  test("custom royalties for a seller - add other recipients", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage)
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1);

    const recipients = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage= ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(seller.id, recipients.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage[index]
      }
    }));
    await waitForGraphNodeIndexing(tx);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1 + recipients.length);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[0])).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[1])).toBe(true);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)?.minRoyaltyPercentage).toEqual(treasuryPercentage);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage[0]);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage[1]);

    const recipients_2 = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage_2= ["400", "500"];
    const tx_2 = await coreSDK.addRoyaltyRecipients(seller.id, recipients_2.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage_2[index]
      }
    }));
    await waitForGraphNodeIndexing(tx_2);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1 + recipients.length + recipients_2.length);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])).toBe(true);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[0]);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[1]);
  });
  test("custom royalties for a seller - update other recipients - check onchain", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage)
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage= ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(seller.id, recipients.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage[index]
      }
    }));
    await tx.wait();
    let royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    console.log("royaltyRecipients", royaltyRecipients);
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients.length);
    expect(royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)).toBe(true);
    expect(royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[0])).toBe(true);
    expect(royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[1])).toBe(true);
    expect(royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)?.minRoyaltyPercentage).toEqual(treasuryPercentage);
    expect(royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage[0]);
    expect(royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage[1]);

    const recipients_2 = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage_2= ["400", "500"];
    const tx_2 = await coreSDK.updateRoyaltyRecipients(seller.id, [1, 2], recipients_2.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage_2[index]
      }
    }));
    await tx_2.wait();
    royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    console.log("royaltyRecipients", royaltyRecipients);
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients_2.length);
    expect(royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])).toBe(true);
    expect(royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])).toBe(true);
    expect(royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[0]);
    expect(royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[1]);
  });
  xtest("custom royalties for a seller - update other recipients - check subgraph", async () => {
    // TODO: This test doesn't pass until we properly manage update/removeRoyaltyRecipients in the subgraph handler
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage)
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage= ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(seller.id, recipients.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage[index]
      }
    }));
    await waitForGraphNodeIndexing(tx);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1 + recipients.length);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[0])).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients[1])).toBe(true);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === ZERO_ADDRESS)?.minRoyaltyPercentage).toEqual(treasuryPercentage);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage[0]);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage[1]);

    const recipients_2 = [Wallet.createRandom().address.toLowerCase(), Wallet.createRandom().address.toLowerCase()];
    const recipientsPercentage_2= ["400", "500"];
    const tx_2 = await coreSDK.updateRoyaltyRecipients(seller.id, [1, 2], recipients_2.map((wallet, index) => {
      return {
        wallet,
        minRoyaltyPercentage: recipientsPercentage_2[index]
      }
    }));
    await waitForGraphNodeIndexing(tx_2);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients.length).toEqual(1 + recipients_2.length);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])).toBe(true);
    expect(seller.royaltyRecipients.some((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])).toBe(true);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[0])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[0]);
    expect(seller.royaltyRecipients.find((recipient) => recipient.wallet.toLowerCase() === recipients_2[1])?.minRoyaltyPercentage).toEqual(recipientsPercentage_2[1]);
  });
  test("royalties #3", async () => {
    // create a seller with some royalties
    // change seller's royalties
    // TODO: create SDK methods for removeRoyaltyRecipients/updateRoyaltyRecipients
  });
});

describe("Offer royalties recipients", () => {
  test("royalties #1", async () => {
    // create a seller with default royalties
    // create an offer with default royalties
    // TODO: subgraph schema add royaltyInfo in Offer entity type
    // TODO: rework OfferCreated handler to add royaltyInfo
  });
  test("royalties #2", async () => {
    // create a seller with some royalties
    // create an offer with some royalties
  });
});