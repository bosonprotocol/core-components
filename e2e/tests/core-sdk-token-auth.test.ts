import { abis } from "@bosonprotocol/common";
import { BigNumber, constants, Contract, utils } from "ethers";
import { defaultAbiCoder } from "@ethersproject/abi";
import {
  createFundedWallet,
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
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC3009_ADDRESS;
      const amount = "1000000000000000000"; // 1 token with 18 decimals

      const token = new Contract(
        tokenAddress,
        abis.ERC3009TokenABI,
        fundedWallet
      );

      // Mint tokens to the signer so the authorization actually transfers value.
      await (await token.mint(fundedWallet.address, amount)).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );

      const { r, s, v, signature, abiData } =
        await coreSDK.signReceiveWithErc3009Authorization(
          tokenAddress,
          { name: "ERC3009Token", version: "1" },
          amount,
          0,
          constants.MaxUint256,
          { spender: recipientWallet.address }
        );

      expect(typeof r).toBe("string");
      expect(typeof s).toBe("string");
      expect(typeof v).toBe("number");
      expect(typeof signature).toBe("string");

      // abiData round-trip
      const [decValidAfter, decValidBefore, decNonce, decV, decR, decS] =
        defaultAbiCoder.decode(
          ["uint256", "uint256", "bytes32", "uint8", "bytes32", "bytes32"],
          abiData
        );
      expect(decValidAfter.toString()).toBe("0");
      expect(decValidBefore.toString()).toBe(constants.MaxUint256.toString());
      expect(decR).toBe(r);
      expect(decS).toBe(s);
      expect(Number(decV)).toBe(v);

      // The recipient pulls the funds by calling receiveWithAuthorization.
      const tokenAsRecipient = token.connect(recipientWallet);
      await (
        await tokenAsRecipient.receiveWithAuthorization(
          fundedWallet.address,
          recipientWallet.address,
          amount,
          decValidAfter,
          decValidBefore,
          decNonce,
          decV,
          decR,
          decS
        )
      ).wait();

      const balanceAfterFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceAfterTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );
      expect(balanceBeforeFrom.sub(balanceAfterFrom).toString()).toBe(amount);
      expect(balanceAfterTo.sub(balanceBeforeTo).toString()).toBe(amount);

      // Authorization nonce is now consumed.
      expect(
        await token.authorizationState(fundedWallet.address, decNonce)
      ).toBe(true);
    });

    test("sign typed data externally (returnTypedDataToSign: true) and verify ERC3009 token transfer", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC3009_ADDRESS;
      const amount = "1000000000000000000"; // 1 token with 18 decimals

      const token = new Contract(
        tokenAddress,
        abis.ERC3009TokenABI,
        fundedWallet
      );

      await (await token.mint(fundedWallet.address, amount)).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );

      // 1. Ask the SDK for the EIP-712 payload to be signed externally.
      const typedData = await coreSDK.signReceiveWithErc3009Authorization(
        tokenAddress,
        { name: "ERC3009Token", version: "1" },
        amount,
        0,
        constants.MaxUint256,
        { spender: recipientWallet.address, returnTypedDataToSign: true }
      );

      // 2. Sign with the user wallet directly. ethers handles EIP712Domain
      //    internally, so pass only the inner struct type.
      const allTypes = typedData.types as Record<
        string,
        { name: string; type: string }[]
      >;
      const signature = await fundedWallet._signTypedData(
        typedData.domain,
        { ReceiveWithAuthorization: allTypes.ReceiveWithAuthorization },
        typedData.message
      );
      const { r, s, v } = utils.splitSignature(signature);
      const nonce = typedData.message.nonce as string;

      // 3. Recipient pulls the funds using the externally-built signature.
      const tokenAsRecipient = token.connect(recipientWallet);
      await (
        await tokenAsRecipient.receiveWithAuthorization(
          fundedWallet.address,
          recipientWallet.address,
          amount,
          0,
          constants.MaxUint256,
          nonce,
          v,
          r,
          s
        )
      ).wait();

      const balanceAfterFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceAfterTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );
      expect(balanceBeforeFrom.sub(balanceAfterFrom).toString()).toBe(amount);
      expect(balanceAfterTo.sub(balanceBeforeTo).toString()).toBe(amount);
      expect(await token.authorizationState(fundedWallet.address, nonce)).toBe(
        true
      );
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
