import {
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  MOCK_ERC3009_ADDRESS,
  MOCK_ERC2612_ADDRESS,
  seedWallet25,
  MOCK_ERC20_ADDRESS
} from "./utils";

jest.setTimeout(60_000);

const seedWallet = seedWallet25; // be sure the seedWallet is not used by another test (to allow concurrent run)

describe("core-sdk-token-auth", () => {
  describe("erc3009", () => {
    test("sign and verify ERC3009 token transfer", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC3009_ADDRESS;
      const recipient = "0x000000000000000000000000000000000000dEaD";
      const amount = "1000000000000000000"; // 1000 tokens with 18 decimals
      expect(false).toBe(true); // Just to avoid "no assertion" error, to be removed when test will be implemented
      // const { r, s, v, functionSignature } =
      //   await coreSDK.signReceiveWithErc3009Authorization(
      //     tokenAddress,
      //     recipient,
      //     amount,
      //     {
      //       validForSeconds: 3600 // Authorization valid for 1 hour
      //     }
      //   );
    });
  });
  describe("erc2612", () => {
    test("sign and verify ERC2612 token transfer", async () => {
    const { coreSDK, fundedWallet } =
      await initCoreSDKWithFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC2612_ADDRESS;
      const recipient = "0x000000000000000000000000000000000000dEaD";
      const amount = "1000000000000000000"; // 1000 tokens with 18 decimals
      expect(false).toBe(true); // Just to avoid "no assertion" error, to be removed when test will be implemented
      // const { r, s, v, functionSignature } =
      //   await coreSDK.signReceiveWithPermit(
      //     tokenAddress,
      //     recipient,
      //     amount,
      //     {
      //       validForSeconds: 3600 // Authorization valid for 1 hour
      //     }
      //   );
    });
  });
  describe("Permit2", () => {
    test("sign and verify Permit2 token transfer", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC20_ADDRESS;
      const recipient = "0x000000000000000000000000000000000000dEaD";
      const amount = "1000000000000000000"; // 1000 tokens with 18 decimals
      expect(false).toBe(true); // Just to avoid "no assertion" error, to be removed when test will be implemented
      // const { r, s, v, functionSignature } =
      //   await coreSDK.signReceiveWithPermit2(
      //     tokenAddress,
      //     recipient,
      //     amount,
      //     {
      //       validForSeconds: 3600 // Authorization valid for 1 hour
      //     }
      //   );
    });
  });
});
