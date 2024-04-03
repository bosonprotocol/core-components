import { Wallet, BigNumber } from "ethers";
import { ZERO_ADDRESS } from "../../packages/core-sdk/tests/mocks";
import {
  createOffer,
  createOfferBatch,
  createSeller,
  createSellerAndOffer,
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  prepareMultiVariantOffers,
  seedWallet23
} from "./utils";
import { productV1 } from "@bosonprotocol/metadata/src";

const seedWallet = seedWallet23; // be sure the seedWallet is not used by another test (to allow concurrent run)

jest.setTimeout(60_000);

describe("Seller royalties recipients", () => {
  let maxRoyaltyPercentage;
  const walletIs_onchain = (expectedWallet: string) => {
    return (recipient) => {
      return recipient.wallet.toLowerCase() === expectedWallet;
    };
  };
  const walletIs_subgraph = (expectedWallet: string) => {
    return (royaltyRecipientXSeller) => {
      return (
        royaltyRecipientXSeller.recipient.wallet.toLowerCase() ===
        expectedWallet
      );
    };
  };
  beforeAll(async () => {
    const coreSDK = initCoreSDKWithWallet(Wallet.createRandom());
    maxRoyaltyPercentage = await coreSDK.getMaxRoyaltyPercentage();
  });
  test("default royalties for a seller", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const seller = await createSeller(coreSDK, fundedWallet.address);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients?.length).toEqual(1);
    expect(seller.royaltyRecipients?.[0].recipient.wallet).toEqual(
      ZERO_ADDRESS
    );
    expect(seller.royaltyRecipients?.[0].minRoyaltyPercentage).toEqual("0");
  });
  test("custom royalties for a seller - non-zero percentage for treasury", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients?.length).toEqual(1);
    expect(seller.royaltyRecipients?.[0].recipient.wallet).toEqual(
      ZERO_ADDRESS
    );
    expect(seller.royaltyRecipients?.[0].minRoyaltyPercentage).toEqual(
      treasuryPercentage
    );
  });
  test("custom royalties for a seller - add other recipients", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients?.length).toEqual(1);

    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await coreSDK.waitForGraphNodeIndexing(tx);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients?.length).toEqual(1 + recipients.length);
    expect(
      seller.royaltyRecipients?.some(walletIs_subgraph(ZERO_ADDRESS))
    ).toBe(true);
    expect(
      seller.royaltyRecipients?.some(walletIs_subgraph(recipients[0]))
    ).toBe(true);
    expect(
      seller.royaltyRecipients?.some(walletIs_subgraph(recipients[1]))
    ).toBe(true);
    expect(
      seller.royaltyRecipients?.find(walletIs_subgraph(ZERO_ADDRESS))
        ?.minRoyaltyPercentage
    ).toEqual(treasuryPercentage);
    expect(
      seller.royaltyRecipients?.find(walletIs_subgraph(recipients[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[0]);
    expect(
      seller.royaltyRecipients?.find(walletIs_subgraph(recipients[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[1]);

    const recipients_2 = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage_2 = ["400", "500"];
    const tx_2 = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients_2.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage_2[index]
        };
      })
    );
    await coreSDK.waitForGraphNodeIndexing(tx_2);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    expect(seller.royaltyRecipients).toBeTruthy();
    expect(seller.royaltyRecipients?.length).toEqual(
      1 + recipients.length + recipients_2.length
    );
    expect(
      seller.royaltyRecipients?.some(walletIs_subgraph(recipients_2[0]))
    ).toBe(true);
    expect(
      seller.royaltyRecipients?.some(walletIs_subgraph(recipients_2[1]))
    ).toBe(true);
    expect(
      seller.royaltyRecipients?.find(walletIs_subgraph(recipients_2[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[0]);
    expect(
      seller.royaltyRecipients?.find(walletIs_subgraph(recipients_2[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[1]);
  });
  test("custom royalties for a seller - update other recipients - check onchain", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx.wait();
    let royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    royaltyRecipients = royaltyRecipients.map((rr) => {
      // ensure the minRoyaltyPercentage is a string
      return {
        ...rr,
        minRoyaltyPercentage: BigNumber.from(rr.minRoyaltyPercentage).toString()
      };
    });
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients.length);
    expect(royaltyRecipients.some(walletIs_onchain(ZERO_ADDRESS))).toBe(true);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[0]))).toBe(true);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[1]))).toBe(true);
    expect(
      royaltyRecipients.find(walletIs_onchain(ZERO_ADDRESS))
        ?.minRoyaltyPercentage
    ).toEqual(treasuryPercentage);
    expect(
      royaltyRecipients.find(walletIs_onchain(recipients[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[0]);
    expect(
      royaltyRecipients.find(walletIs_onchain(recipients[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[1]);

    const recipients_2 = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage_2 = ["400", "500"];
    const tx_2 = await coreSDK.updateRoyaltyRecipients(
      seller.id,
      [1, 2],
      recipients_2.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage_2[index]
        };
      })
    );
    await tx_2.wait();
    royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    royaltyRecipients = royaltyRecipients.map((rr) => {
      // ensure the minRoyaltyPercentage is a string
      return {
        ...rr,
        minRoyaltyPercentage: BigNumber.from(rr.minRoyaltyPercentage).toString()
      };
    });
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients_2.length);
    expect(royaltyRecipients.some(walletIs_onchain(recipients_2[0]))).toBe(
      true
    );
    expect(royaltyRecipients.some(walletIs_onchain(recipients_2[1]))).toBe(
      true
    );
    expect(
      royaltyRecipients.find(walletIs_onchain(recipients_2[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[0]);
    expect(
      royaltyRecipients.find(walletIs_onchain(recipients_2[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[1]);
  });
  test("custom royalties for a seller - update other recipients - check subgraph", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await coreSDK.waitForGraphNodeIndexing(tx);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    let royaltyRecipients = seller.royaltyRecipients;
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients?.length).toEqual(1 + recipients.length);
    expect(royaltyRecipients?.some(walletIs_subgraph(ZERO_ADDRESS))).toBe(true);
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[0]))).toBe(
      true
    );
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[1]))).toBe(
      true
    );
    expect(
      royaltyRecipients?.find(walletIs_subgraph(ZERO_ADDRESS))
        ?.minRoyaltyPercentage
    ).toEqual(treasuryPercentage);
    expect(
      royaltyRecipients?.find(walletIs_subgraph(recipients[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[0]);
    expect(
      royaltyRecipients?.find(walletIs_subgraph(recipients[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage[1]);

    const recipients_2 = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage_2 = ["400", "500"];
    const tx_2 = await coreSDK.updateRoyaltyRecipients(
      seller.id,
      [1, 2],
      recipients_2.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage_2[index]
        };
      })
    );
    await coreSDK.waitForGraphNodeIndexing(tx_2);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    royaltyRecipients = seller.royaltyRecipients;
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients?.length).toEqual(1 + recipients_2.length);
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients_2[0]))).toBe(
      true
    );
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients_2[1]))).toBe(
      true
    );
    expect(
      royaltyRecipients?.find(walletIs_subgraph(recipients_2[0]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[0]);
    expect(
      royaltyRecipients?.find(walletIs_subgraph(recipients_2[1]))
        ?.minRoyaltyPercentage
    ).toEqual(recipientsPercentage_2[1]);
  });
  test("custom royalties for a seller - remove other recipients - check onchain", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    const seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx.wait();
    let royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients.length);
    expect(royaltyRecipients.some(walletIs_onchain(ZERO_ADDRESS))).toBe(true);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[0]))).toBe(true);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[1]))).toBe(true);

    const recipient2Index = royaltyRecipients.findIndex(
      walletIs_onchain(recipients[1])
    );
    expect(recipient2Index).not.toBe(-1);

    const tx_2 = await coreSDK.removeRoyaltyRecipients(seller.id, [
      recipient2Index
    ]);
    await tx_2.wait();
    royaltyRecipients = await coreSDK.getRoyaltyRecipients(seller.id);
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients.length).toEqual(1 + recipients.length - 1);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[0]))).toBe(true);
    expect(royaltyRecipients.some(walletIs_onchain(recipients[1]))).toBe(false);
  });
  test("custom royalties for a seller - remove other recipients - check subgraph", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const treasuryPercentage = "100"; // 1%
    expect(Number(treasuryPercentage)).toBeLessThan(maxRoyaltyPercentage);
    let seller = await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: treasuryPercentage
      }
    });
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await coreSDK.waitForGraphNodeIndexing(tx);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    let royaltyRecipients = seller.royaltyRecipients;
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients?.length).toEqual(1 + recipients.length);
    expect(royaltyRecipients?.some(walletIs_subgraph(ZERO_ADDRESS))).toBe(true);
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[0]))).toBe(
      true
    );
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[1]))).toBe(
      true
    );

    // Find the index of recipients[1] in the onChain result
    const royaltyRecipientsOnChain = await coreSDK.getRoyaltyRecipients(
      seller.id
    );
    const recipient2Index = royaltyRecipientsOnChain.findIndex(
      walletIs_onchain(recipients[1])
    ) as number;
    expect(recipient2Index).not.toBe(-1);

    const tx_2 = await coreSDK.removeRoyaltyRecipients(seller.id, [
      recipient2Index
    ]);
    await coreSDK.waitForGraphNodeIndexing(tx_2);
    seller = await coreSDK.getSellerById(seller.id);
    expect(seller).toBeTruthy();
    royaltyRecipients = seller.royaltyRecipients;
    expect(royaltyRecipients).toBeTruthy();
    expect(royaltyRecipients?.length).toEqual(1 + recipients.length - 1);
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[0]))).toBe(
      true
    );
    expect(royaltyRecipients?.some(walletIs_subgraph(recipients[1]))).toBe(
      false
    );
  });
});

describe.only("Offer royalties recipients", () => {
  test("royalties #1 zero royalties by default", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    expect(createdOffer.royaltyInfos[0].recipients).toBeTruthy();
    expect(createdOffer.royaltyInfos[0].recipients?.length).toEqual(0);
  });
  test("royalties #2 zero minimum - set treasury royalty for offer", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    await createSeller(coreSDK, fundedWallet.address);
    const treasuryPercentage = "100"; // 1%
    const createdOffer = await createOffer(coreSDK, {
      royaltyInfo: [
        {
          recipients: [ZERO_ADDRESS],
          bps: [treasuryPercentage]
        }
      ]
    });
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    expect(createdOffer.royaltyInfos[0].recipients).toBeTruthy();
    expect(createdOffer.royaltyInfos[0].recipients?.length).toEqual(1);
    expect(
      createdOffer.royaltyInfos[0].recipients?.[0].recipient.wallet
    ).toEqual(ZERO_ADDRESS);
    expect(
      createdOffer.royaltyInfos[0].recipients?.[0].recipient.wallet
    ).toEqual(ZERO_ADDRESS);
    expect(createdOffer.royaltyInfos[0].recipients?.[0].bps).toEqual(
      treasuryPercentage
    );
  });
  test("royalties #3 offer requires at least the minimum royalty percentage", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    // Set a >0 minimum royalty percentage for the seller
    const minTreasuryPercentage = "100"; // 1%
    await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: minTreasuryPercentage
      }
    });
    // Try to create an offer with insufficient royalties
    (
      await expect(
        createOffer(coreSDK, {
          royaltyInfo: [
            {
              recipients: [ZERO_ADDRESS],
              bps: ["50"] // less than the minimum
            }
          ]
        })
      )
    ).rejects.toThrow(/InvalidRoyaltyPercentage()/);
    // Create an offer with all royalties for treasury
    const createdOffer = await createOffer(coreSDK, {
      royaltyInfo: [
        {
          recipients: [ZERO_ADDRESS],
          bps: [minTreasuryPercentage]
        }
      ]
    });
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    expect(createdOffer.royaltyInfos[0].recipients).toBeTruthy();
    expect(createdOffer.royaltyInfos[0].recipients?.length).toEqual(1);
    expect(
      createdOffer.royaltyInfos[0].recipients?.[0].recipient.wallet
    ).toEqual(ZERO_ADDRESS);
    expect(
      createdOffer.royaltyInfos[0].recipients?.[0].recipient.wallet
    ).toEqual(ZERO_ADDRESS);
    expect(createdOffer.royaltyInfos[0].recipients?.[0].bps).toEqual(
      minTreasuryPercentage
    );
  });
  test("royalties #4 zero minimum - set several royalty recipients for offer", async () => {
    const walletIs_subgraph = (expectedWallet: string) => {
      return (royaltyRecipientXOffer) => {
        return (
          royaltyRecipientXOffer.recipient.wallet.toLowerCase() ===
          expectedWallet
        );
      };
    };
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const seller = await createSeller(coreSDK, fundedWallet.address);
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx.wait();
    const createdOffer = await createOffer(coreSDK, {
      royaltyInfo: [
        {
          recipients,
          bps: recipientsPercentage
        }
      ]
    });
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    // Offer royalties includes both recipients
    expect(createdOffer.royaltyInfos[0].recipients).toBeTruthy();
    expect(createdOffer.royaltyInfos[0].recipients?.length).toEqual(2);
    expect(
      createdOffer.royaltyInfos[0].recipients?.some(
        walletIs_subgraph(recipients[0])
      )
    ).toBe(true);
    expect(
      createdOffer.royaltyInfos[0].recipients?.some(
        walletIs_subgraph(recipients[1])
      )
    ).toBe(true);
    // Offer royalties does not include treasury
    expect(
      createdOffer.royaltyInfos[0].recipients?.some(
        walletIs_subgraph(ZERO_ADDRESS)
      )
    ).toBe(false);
  });
  test("royalties #5 positive minimum royalty and offer with no royalties", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    // Set a >0 minimum royalty percentage for the seller
    const minTreasuryPercentage = "100"; // 1%
    await createSeller(coreSDK, fundedWallet.address, {
      sellerParams: {
        royaltyPercentage: minTreasuryPercentage
      }
    });
    // Create an offer with no royalty
    const createdOffer = await createOffer(coreSDK);
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    expect(createdOffer.royaltyInfos[0].recipients).toBeTruthy();
    expect(createdOffer.royaltyInfos[0].recipients?.length).toEqual(0);
  });
  test("updateOfferRoyaltyRecipients()", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx1 = await coreSDK.addRoyaltyRecipients(
      createdOffer.seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx1.wait();
    const newRoyaltyInfo = {
      recipients,
      bps: recipientsPercentage
    };
    const tx2 = await coreSDK.updateOfferRoyaltyRecipients(
      createdOffer.id,
      newRoyaltyInfo
    );
    await coreSDK.waitForGraphNodeIndexing(tx2);
    const offer = await coreSDK.getOfferById(createdOffer.id);
    expect(offer.royaltyInfos).toBeTruthy();
    expect(offer.royaltyInfos.length).toEqual(2);
    const mostRecentRoyaltyInfo = offer.royaltyInfos.reduce(
      (prev, current) =>
        BigNumber.from(current.timestamp).gt(prev.timestamp) ? current : prev,
      offer.royaltyInfos[0]
    );
    expect(mostRecentRoyaltyInfo?.recipients?.length).toEqual(
      recipients.length
    );
  });
  test("updateOfferRoyaltyRecipientsBatch() - only 1 offer", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const createdOffer = await createSellerAndOffer(
      coreSDK,
      fundedWallet.address
    );
    expect(createdOffer.royaltyInfos).toBeTruthy();
    expect(createdOffer.royaltyInfos.length).toEqual(1);
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx1 = await coreSDK.addRoyaltyRecipients(
      createdOffer.seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx1.wait();
    const newRoyaltyInfo = {
      recipients,
      bps: recipientsPercentage
    };
    const tx2 = await coreSDK.updateOfferRoyaltyRecipientsBatch(
      [createdOffer.id],
      newRoyaltyInfo
    );
    await coreSDK.waitForGraphNodeIndexing(tx2);
    const offer = await coreSDK.getOfferById(createdOffer.id);
    expect(offer.royaltyInfos).toBeTruthy();
    expect(offer.royaltyInfos.length).toEqual(2);
    const mostRecentRoyaltyInfo = offer.royaltyInfos.reduce(
      (prev, current) =>
        BigNumber.from(current.timestamp).gt(prev.timestamp) ? current : prev,
      offer.royaltyInfos[0]
    );
    expect(mostRecentRoyaltyInfo?.recipients?.length).toEqual(
      recipients.length
    );
  });
  test("updateOfferRoyaltyRecipientsBatch() - 3 offers", async () => {
    const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
      seedWallet
    );
    const seller = await createSeller(coreSDK, fundedWallet.address);
    const productVariations: productV1.ProductV1Variant[] = [
      [
        {
          type: "Size",
          option: "S"
        }
      ],
      [
        {
          type: "Size",
          option: "M"
        }
      ],
      [
        {
          type: "Size",
          option: "L"
        }
      ]
    ];
    const { offerArgs } = await prepareMultiVariantOffers(
      coreSDK,
      productVariations
    );
    const createdOffers = await createOfferBatch(
      coreSDK,
      fundedWallet,
      offerArgs
    );
    createdOffers.forEach((createdOffer) => {
      expect(createdOffer.royaltyInfos).toBeTruthy();
      expect(createdOffer.royaltyInfos.length).toEqual(1);
    });
    const recipients = [
      Wallet.createRandom().address.toLowerCase(),
      Wallet.createRandom().address.toLowerCase()
    ];
    const recipientsPercentage = ["200", "300"];
    const tx1 = await coreSDK.addRoyaltyRecipients(
      seller.id,
      recipients.map((wallet, index) => {
        return {
          wallet,
          minRoyaltyPercentage: recipientsPercentage[index]
        };
      })
    );
    await tx1.wait();
    const newRoyaltyInfo = {
      recipients,
      bps: recipientsPercentage
    };
    const tx2 = await coreSDK.updateOfferRoyaltyRecipientsBatch(
      createdOffers.map((offer) => offer.id),
      newRoyaltyInfo
    );
    await coreSDK.waitForGraphNodeIndexing(tx2);
    createdOffers.forEach(async (createdOffer) => {
      const offer = await coreSDK.getOfferById(createdOffer.id);
      expect(offer.royaltyInfos).toBeTruthy();
      expect(offer.royaltyInfos.length).toEqual(2);
      const mostRecentRoyaltyInfo = offer.royaltyInfos.reduce(
        (prev, current) =>
          BigNumber.from(current.timestamp).gt(prev.timestamp) ? current : prev,
        offer.royaltyInfos[0]
      );
      expect(mostRecentRoyaltyInfo?.recipients?.length).toEqual(
        recipients.length
      );
    });
  });
});
