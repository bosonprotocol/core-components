import { abis } from "@bosonprotocol/common";
import { BigNumber, constants, Contract, utils } from "ethers";
import {
  createFundedWallet,
  initCoreSDKWithFundedWallet,
  initCoreSDKWithWallet,
  mockErc20Contract,
  MOCK_ERC3009_ADDRESS,
  MOCK_ERC2612_ADDRESS,
  MOCK_PERMIT2_ADDRESS,
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

      const auth = await coreSDK.signReceiveWithErc3009Authorization(
        tokenAddress,
        { name: "ERC3009Token", version: "1" },
        amount,
        0,
        constants.MaxUint256,
        { spender: recipientWallet.address }
      );
      const { r, s, v, signature } = auth;

      expect(typeof r).toBe("string");
      expect(typeof s).toBe("string");
      expect(typeof v).toBe("number");
      expect(typeof signature).toBe("string");
      expect(auth.strategy).toBe("ERC3009");
      expect(auth.data.validAfter.toString()).toBe("0");
      expect(auth.data.validBefore.toString()).toBe(
        constants.MaxUint256.toString()
      );

      // The recipient pulls the funds by calling receiveWithAuthorization.
      const tokenAsRecipient = token.connect(recipientWallet);
      await (
        await tokenAsRecipient.receiveWithAuthorization(
          fundedWallet.address,
          recipientWallet.address,
          amount,
          auth.data.validAfter,
          auth.data.validBefore,
          auth.data.nonce,
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

      // Authorization nonce is now consumed.
      expect(
        await token.authorizationState(fundedWallet.address, auth.data.nonce)
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
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC2612_ADDRESS;
      const amount = "1000000000000000000"; // 1 token with 18 decimals

      const token = new Contract(
        tokenAddress,
        abis.ERC2612TokenABI,
        fundedWallet
      );

      await (await token.mint(fundedWallet.address, amount)).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );
      const nonceBefore: BigNumber = await token.nonces(fundedWallet.address);

      const auth = await coreSDK.signReceiveWithErc2612Permit(
        tokenAddress,
        { name: "ERC2612Token", version: "1" },
        amount,
        constants.MaxUint256,
        { spender: recipientWallet.address }
      );
      const { r, s, v, signature } = auth;

      expect(typeof r).toBe("string");
      expect(typeof s).toBe("string");
      expect(typeof v).toBe("number");
      expect(typeof signature).toBe("string");
      expect(auth.strategy).toBe("EIP2612");
      expect(auth.data.deadline.toString()).toBe(
        constants.MaxUint256.toString()
      );

      // 1. Apply permit (anyone can submit it; spender does it here).
      const tokenAsRecipient = token.connect(recipientWallet);
      await (
        await tokenAsRecipient.permit(
          fundedWallet.address,
          recipientWallet.address,
          amount,
          auth.data.deadline,
          v,
          r,
          s
        )
      ).wait();
      // 2. Spender pulls the funds via transferFrom.
      await (
        await tokenAsRecipient.transferFrom(
          fundedWallet.address,
          recipientWallet.address,
          amount
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

      // Permit nonce was advanced.
      const nonceAfter: BigNumber = await token.nonces(fundedWallet.address);
      expect(nonceAfter.sub(nonceBefore).toString()).toBe("1");
    });

    test("sign typed data externally (returnTypedDataToSign: true) and verify ERC2612 token transfer", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC2612_ADDRESS;
      const amount = "1000000000000000000";

      const token = new Contract(
        tokenAddress,
        abis.ERC2612TokenABI,
        fundedWallet
      );

      await (await token.mint(fundedWallet.address, amount)).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );
      const nonceBefore: BigNumber = await token.nonces(fundedWallet.address);

      // 1. Ask the SDK for the EIP-712 payload to be signed externally.
      const typedData = await coreSDK.signReceiveWithErc2612Permit(
        tokenAddress,
        { name: "ERC2612Token", version: "1" },
        amount,
        constants.MaxUint256,
        { spender: recipientWallet.address, returnTypedDataToSign: true }
      );

      // 2. Sign with the user wallet directly.
      const allTypes = typedData.types as Record<
        string,
        { name: string; type: string }[]
      >;
      const signature = await fundedWallet._signTypedData(
        typedData.domain,
        { Permit: allTypes.Permit },
        typedData.message
      );
      const { r, s, v } = utils.splitSignature(signature);
      const deadline = typedData.message.deadline as string;

      // 3. Apply permit then transferFrom from the recipient.
      const tokenAsRecipient = token.connect(recipientWallet);
      await (
        await tokenAsRecipient.permit(
          fundedWallet.address,
          recipientWallet.address,
          amount,
          deadline,
          v,
          r,
          s
        )
      ).wait();
      await (
        await tokenAsRecipient.transferFrom(
          fundedWallet.address,
          recipientWallet.address,
          amount
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

      const nonceAfter: BigNumber = await token.nonces(fundedWallet.address);
      expect(nonceAfter.sub(nonceBefore).toString()).toBe("1");
    });
  });
  describe("Permit2", () => {
    test("sign and verify Permit2 token transfer", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC20_ADDRESS;
      const amount = "1000000000000000000"; // 1 token with 18 decimals

      const token = mockErc20Contract.connect(fundedWallet);
      const permit2 = new Contract(
        MOCK_PERMIT2_ADDRESS,
        abis.Permit2ABI,
        recipientWallet
      );

      // Mint tokens + pre-approve Permit2 (required once per token).
      await (await token.mint(fundedWallet.address, amount)).wait();
      await (
        await token.approve(MOCK_PERMIT2_ADDRESS, constants.MaxUint256)
      ).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );

      const auth = await coreSDK.signReceiveWithPermit2(
        tokenAddress,
        amount,
        constants.MaxUint256,
        { spender: recipientWallet.address }
      );
      const { r, s, v, signature } = auth;

      expect(typeof r).toBe("string");
      expect(typeof s).toBe("string");
      expect(typeof v).toBe("number");
      expect(typeof signature).toBe("string");
      expect(auth.strategy).toBe("Permit2");
      expect(auth.data.deadline.toString()).toBe(
        constants.MaxUint256.toString()
      );

      // Pre-check: Permit2 nonce bit is clear.
      const permit2Nonce = BigNumber.from(auth.data.nonce);
      const wordPos = permit2Nonce.shr(8);
      const bitPos = permit2Nonce.and(0xff);
      const bit = BigNumber.from(1).shl(bitPos.toNumber());
      const bitmapBefore: BigNumber = await permit2.nonceBitmap(
        fundedWallet.address,
        wordPos
      );
      expect(bitmapBefore.and(bit).isZero()).toBe(true);

      // Recipient (= signed spender) pulls funds via Permit2.
      await (
        await permit2.permitTransferFrom(
          {
            permitted: { token: tokenAddress, amount },
            nonce: auth.data.nonce,
            deadline: auth.data.deadline
          },
          { to: recipientWallet.address, requestedAmount: amount },
          fundedWallet.address,
          signature
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

      // Permit2 nonce bit is now set.
      const bitmapAfter: BigNumber = await permit2.nonceBitmap(
        fundedWallet.address,
        wordPos
      );
      expect(bitmapAfter.and(bit).eq(bit)).toBe(true);
    });

    test("sign typed data externally (returnTypedDataToSign: true) and verify Permit2 token transfer", async () => {
      const { coreSDK, fundedWallet } =
        await initCoreSDKWithFundedWallet(seedWallet);
      const recipientWallet = await createFundedWallet(seedWallet);
      const tokenAddress = MOCK_ERC20_ADDRESS;
      const amount = "1000000000000000000";

      const token = mockErc20Contract.connect(fundedWallet);
      const permit2 = new Contract(
        MOCK_PERMIT2_ADDRESS,
        abis.Permit2ABI,
        recipientWallet
      );

      await (await token.mint(fundedWallet.address, amount)).wait();
      await (
        await token.approve(MOCK_PERMIT2_ADDRESS, constants.MaxUint256)
      ).wait();

      const balanceBeforeFrom: BigNumber = await token.balanceOf(
        fundedWallet.address
      );
      const balanceBeforeTo: BigNumber = await token.balanceOf(
        recipientWallet.address
      );

      // 1. Ask the SDK for the EIP-712 payload to be signed externally.
      const typedData = await coreSDK.signReceiveWithPermit2(
        tokenAddress,
        amount,
        constants.MaxUint256,
        { spender: recipientWallet.address, returnTypedDataToSign: true }
      );

      // 2. Sign with the user wallet directly (pass both struct types — ethers
      //    handles EIP712Domain internally).
      const allTypes = typedData.types as Record<
        string,
        { name: string; type: string }[]
      >;
      const signature = await fundedWallet._signTypedData(
        typedData.domain,
        {
          PermitTransferFrom: allTypes.PermitTransferFrom,
          TokenPermissions: allTypes.TokenPermissions
        },
        typedData.message
      );
      // Sanity-split for readability (not used by Permit2 directly).
      const split = utils.splitSignature(signature);
      expect(typeof split.r).toBe("string");

      const nonce = typedData.message.nonce as string;
      const deadline = typedData.message.deadline as string;

      // 3. Permit2.permitTransferFrom with the externally-built signature.
      await (
        await permit2.permitTransferFrom(
          {
            permitted: { token: tokenAddress, amount },
            nonce,
            deadline
          },
          { to: recipientWallet.address, requestedAmount: amount },
          fundedWallet.address,
          signature
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

      // Permit2 nonce bit is now set.
      const wordPos = BigNumber.from(nonce).shr(8);
      const bitPos = BigNumber.from(nonce).and(0xff);
      const bit = BigNumber.from(1).shl(bitPos.toNumber());
      const bitmap: BigNumber = await permit2.nonceBitmap(
        fundedWallet.address,
        wordPos
      );
      expect(bitmap.and(bit).eq(bit)).toBe(true);
    });
  });
});
