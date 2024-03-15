import { AuthTokenType } from "../../packages/common";
import {
  createSeller,
  initCoreSDKWithFundedWallet,
  mintLensToken,
  seedWallet21,
  updateSeller
} from "./utils";
import { Wallet } from "ethers";
import { ZERO_ADDRESS } from "../../packages/core-sdk/tests/mocks";

jest.setTimeout(60_000);

describe("CoreSDK Accounts", () => {
  let admin1;
  let assistant1;
  let treasury1and2;
  let admin2;
  let assistant2;
  let authTokenId2;
  let coreSDK;
  let sellerId1;
  let sellerId2;
  beforeAll(async () => {
    const { coreSDK: coreSDK1, fundedWallet: sellerWallet1 } =
      await initCoreSDKWithFundedWallet(seedWallet21);
    const { coreSDK: coreSDKAssistant1, fundedWallet: assistantWallet1 } =
      await initCoreSDKWithFundedWallet(seedWallet21);
    coreSDK = coreSDK1;
    const { coreSDK: coreSDK2, fundedWallet: sellerWallet2 } =
      await initCoreSDKWithFundedWallet(seedWallet21);
    const { coreSDK: coreSDKAssistant2, fundedWallet: assistantWallet2 } =
      await initCoreSDKWithFundedWallet(seedWallet21);
    const treasuryWallet1and2 = Wallet.createRandom();
    treasury1and2 = treasuryWallet1and2.address;
    await Promise.all([
      new Promise<void>(async (resolve, reject) => {
        // Create seller1 and update so that the assistant != admin != treasury
        try {
          let seller1 = await createSeller(coreSDK1, sellerWallet1.address);
          expect(seller1).toBeTruthy();
          sellerId1 = seller1.id;
          admin1 = sellerWallet1.address;
          assistant1 = assistantWallet1.address;
          seller1 = await updateSeller(
            coreSDK1,
            seller1,
            {
              assistant: assistant1,
              treasury: treasury1and2
            },
            [
              {
                coreSDK: coreSDKAssistant1,
                fieldsToUpdate: {
                  assistant: true
                }
              }
            ]
          );
          expect(seller1).toBeTruthy();
          resolve();
        } catch (e) {
          reject(e);
        }
      }),
      new Promise<void>(async (resolve, reject) => {
        // Create seller2 and update so that the assistant != admin != treasury, and admin is defined by an authTokenId
        try {
          const tokenType = AuthTokenType.LENS;
          authTokenId2 = await mintLensToken(
            sellerWallet2,
            sellerWallet2.address
          );
          let seller2 = await createSeller(coreSDK2, sellerWallet2.address);
          expect(seller2).toBeTruthy();
          sellerId2 = seller2.id;
          admin2 = sellerWallet2.address;
          assistant2 = assistantWallet2.address;
          seller2 = await updateSeller(
            coreSDK2,
            seller2,
            {
              admin: ZERO_ADDRESS,
              authTokenType: tokenType,
              authTokenId: authTokenId2.toString(),
              assistant: assistant2,
              treasury: treasury1and2
            },
            [
              {
                coreSDK: coreSDKAssistant2,
                fieldsToUpdate: {
                  assistant: true
                }
              }
            ]
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    ]);
  });
  test("Find a seller from assistant wallet address", async () => {
    let seller = await coreSDK.getSellerByAssistant(assistant1);
    expect(seller.id).toEqual(sellerId1);
    seller = await coreSDK.getSellerByAdmin(assistant1);
    expect(seller).not.toBeTruthy();
    const sellers = await coreSDK.getSellersByTreasury(assistant1);
    expect(sellers.length).toEqual(0);
  });
  test("Find a seller from admin wallet address", async () => {
    let seller = await coreSDK.getSellerByAdmin(admin1);
    expect(seller.id).toEqual(sellerId1);
    seller = await coreSDK.getSellerByAssistant(admin1);
    expect(seller).not.toBeTruthy();
    const sellers = await coreSDK.getSellersByTreasury(admin1);
    expect(sellers.length).toEqual(0);
  });
  test("Find sellers from treasury wallet address", async () => {
    let seller = await coreSDK.getSellerByAdmin(treasury1and2);
    expect(seller).not.toBeTruthy();
    seller = await coreSDK.getSellerByAssistant(treasury1and2);
    expect(seller).not.toBeTruthy();
    const sellers = await coreSDK.getSellersByTreasury(treasury1and2);
    expect(sellers.length).toEqual(2);
    expect(sellers.some((seller) => seller.id === sellerId1)).toBe(true);
    expect(sellers.some((seller) => seller.id === sellerId2)).toBe(true);
  });
  test("Find a seller from auth tokenId", async () => {
    let seller = await coreSDK.getSellerByAdmin(admin2);
    expect(seller).not.toBeTruthy();
    seller = await coreSDK.getSellerByAssistant(admin2);
    expect(seller).not.toBeTruthy();
    const sellers = await coreSDK.getSellersByTreasury(admin2);
    expect(sellers.length).toEqual(0);
    [seller] = await coreSDK.getSellersByAddress(admin2);
    expect(seller.id).toEqual(sellerId2);
  });
});
