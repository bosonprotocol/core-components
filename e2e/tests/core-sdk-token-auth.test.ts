import {
  abis,
  FullOfferArgs,
  GatingType,
  OfferCreator
} from "@bosonprotocol/common";
import { parseEther } from "@ethersproject/units";
import {
  BigNumber,
  BigNumberish,
  constants,
  Contract,
  utils,
  Wallet
} from "ethers";
import { CoreSDK } from "../../packages/core-sdk/src";
import { TransferAuthorization } from "../../packages/core-sdk/src/erc20/handler";
import EvaluationMethod from "../../contracts/protocol-contracts/scripts/domain/EvaluationMethod";
import TokenType from "../../contracts/protocol-contracts/scripts/domain/TokenType";
import {
  MSEC_PER_DAY,
  MSEC_PER_SEC
} from "../../packages/common/src/utils/timestamp";
import {
  buildFullOfferArgs,
  createDisputeResolver,
  createFundedWallet,
  createOffer,
  createOfferWithCondition,
  createSeller,
  deployerWallet,
  ensureMintedERC1155,
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  mockErc20Contract,
  MOCK_ERC1155_ADDRESS,
  MOCK_ERC20_ADDRESS,
  MOCK_ERC2612_ADDRESS,
  MOCK_ERC3009_ADDRESS,
  MOCK_PERMIT2_ADDRESS,
  seedWallet25
} from "./utils";
import { MOCK_ERC20_ABI } from "./mockAbis";

jest.setTimeout(120_000);

const seedWallet = seedWallet25; // be sure the seedWallet is not used by another test (to allow concurrent run)

// ─── Strategy table ────────────────────────────────────────────────────────────

type Strategy = "ERC3009" | "EIP2612" | "Permit2";
const STRATEGIES: Strategy[] = ["ERC3009", "EIP2612", "Permit2"];

const ERC3009_DOMAIN = { name: "ERC3009Token", version: "1" };
const ERC2612_DOMAIN = { name: "ERC2612Token", version: "1" };

function exchangeTokenFor(strategy: Strategy): string {
  switch (strategy) {
    case "ERC3009":
      return MOCK_ERC3009_ADDRESS;
    case "EIP2612":
      return MOCK_ERC2612_ADDRESS;
    case "Permit2":
      return MOCK_ERC20_ADDRESS;
  }
}

function tokenAbiFor(strategy: Strategy): unknown[] {
  switch (strategy) {
    case "ERC3009":
      return abis.ERC3009TokenABI;
    case "EIP2612":
      return abis.ERC2612TokenABI;
    case "Permit2":
      return MOCK_ERC20_ABI;
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function mintMockToken(
  wallet: Wallet,
  strategy: Strategy,
  amount: BigNumberish
): Promise<void> {
  const token = new Contract(
    exchangeTokenFor(strategy),
    tokenAbiFor(strategy),
    wallet
  );
  await (await token.mint(wallet.address, amount)).wait();
}

async function approvePermit2(wallet: Wallet): Promise<void> {
  const token = new Contract(MOCK_ERC20_ADDRESS, abis.ERC20ABI, wallet);
  await (
    await token.approve(MOCK_PERMIT2_ADDRESS, constants.MaxUint256)
  ).wait();
}

async function setUpFunderWallet(
  wallet: Wallet,
  strategy: Strategy,
  amount: BigNumberish
): Promise<void> {
  await mintMockToken(wallet, strategy, amount);
  if (strategy === "Permit2") {
    await approvePermit2(wallet);
  }
}

async function signAuth(
  coreSDK: CoreSDK,
  strategy: Strategy,
  exchangeToken: string,
  value: BigNumberish
): Promise<TransferAuthorization> {
  switch (strategy) {
    case "ERC3009":
      return coreSDK.signReceiveWithErc3009Authorization(
        exchangeToken,
        ERC3009_DOMAIN,
        value,
        0,
        constants.MaxUint256
      );
    case "EIP2612":
      return coreSDK.signReceiveWithErc2612Permit(
        exchangeToken,
        ERC2612_DOMAIN,
        value,
        constants.MaxUint256
      );
    case "Permit2":
      return coreSDK.signReceiveWithPermit2(
        exchangeToken,
        value,
        constants.MaxUint256
      );
  }
}

async function createDrForToken(
  exchangeToken: string,
  drFeeAmount: BigNumberish
) {
  const { fundedWallet: drFundedWallet } =
    await initCoreSDKWithFundedWallet(seedWallet);
  const drAddress = drFundedWallet.address.toLowerCase();
  const { disputeResolver } = await createDisputeResolver(
    drFundedWallet,
    deployerWallet,
    {
      assistant: drAddress,
      admin: drAddress,
      treasury: drAddress,
      metadataUri: "",
      escalationResponsePeriodInMS: 90 * MSEC_PER_DAY - 1 * MSEC_PER_SEC,
      fees: [
        {
          feeAmount: drFeeAmount,
          tokenAddress: exchangeToken,
          tokenName: "ERC20"
        }
      ],
      sellerAllowList: []
    }
  );
  return disputeResolver;
}

const noCondition = {
  method: EvaluationMethod.None,
  tokenType: TokenType.MultiToken,
  tokenAddress: constants.AddressZero,
  gatingType: GatingType.PerAddress,
  minTokenId: "0",
  maxTokenId: "0",
  threshold: "0",
  maxCommits: "0"
};

// ─── Tests ─────────────────────────────────────────────────────────────────────

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

  describe("meta-tx with transfer authorizations", () => {
    describe("commitToOffer", () => {
      STRATEGIES.forEach((strategy) => {
        test(`${strategy} auth — non-native exchange token offer`, async () => {
          const exchangeToken = exchangeTokenFor(strategy);

          // Fresh DR that accepts this token (drFee = 0 to keep things simple).
          const disputeResolver = await createDrForToken(exchangeToken, "0");

          // Fresh seller + buyer wallets (parallel-safe).
          const { sellerCoreSDK, buyerCoreSDK, buyerWallet, sellerWallet } =
            await initSellerAndBuyerSDKs(seedWallet);

          // Seller account is required to create an offer.
          await createSeller(sellerCoreSDK, sellerWallet.address);

          // sellerDeposit = 0 so the seller doesn't need to pre-deposit anything.
          const offer = await createOffer(sellerCoreSDK, {
            exchangeToken,
            disputeResolverId: disputeResolver.id,
            sellerDeposit: "0",
            quantityAvailable: 1
          });

          // Mint exchange token to the buyer (and Permit2-approve, for Permit2).
          await setUpFunderWallet(buyerWallet, strategy, offer.price);

          // Buyer signs the transfer authorization for offer.price.
          const buyerAuth = await signAuth(
            buyerCoreSDK,
            strategy,
            exchangeToken,
            offer.price
          );

          const nonce = Date.now();
          const { r, s, v, functionName, functionSignature } =
            await buyerCoreSDK.signMetaTxCommitToOffer({
              offerId: offer.id,
              nonce
            });

          const metaTx = await buyerCoreSDK.relayMetaTransaction({
            functionName,
            functionSignature,
            nonce,
            sigR: r,
            sigS: s,
            sigV: v,
            transferAuthorizations: [buyerAuth]
          });
          const metaTxReceipt = await metaTx.wait();
          expect(metaTxReceipt.transactionHash).toBeTruthy();
          expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(
            true
          );
        });
      });
    });

    describe("commitToConditionalOffer", () => {
      STRATEGIES.forEach((strategy) => {
        test(`${strategy} auth — non-native exchange token conditional offer`, async () => {
          const exchangeToken = exchangeTokenFor(strategy);
          const tokenID = Date.now().toString();

          const disputeResolver = await createDrForToken(exchangeToken, "0");

          const { sellerCoreSDK, buyerCoreSDK, buyerWallet, sellerWallet } =
            await initSellerAndBuyerSDKs(seedWallet);

          await createSeller(sellerCoreSDK, sellerWallet.address);

          // Mint the gating ERC1155 token to the buyer so the condition holds.
          await ensureMintedERC1155(buyerWallet, tokenID, "5");

          const condition = {
            method: EvaluationMethod.Threshold,
            tokenType: TokenType.MultiToken,
            tokenAddress: MOCK_ERC1155_ADDRESS.toLowerCase(),
            gatingType: GatingType.PerAddress,
            minTokenId: tokenID,
            maxTokenId: tokenID,
            threshold: "1",
            maxCommits: "3"
          };

          const offer = await createOfferWithCondition(
            sellerCoreSDK,
            condition,
            {
              offerParams: {
                exchangeToken,
                disputeResolverId: disputeResolver.id,
                sellerDeposit: "0",
                quantityAvailable: 1
              }
            }
          );

          await setUpFunderWallet(buyerWallet, strategy, offer.price);

          const buyerAuth = await signAuth(
            buyerCoreSDK,
            strategy,
            exchangeToken,
            offer.price
          );

          const nonce = Date.now();
          const { r, s, v, functionName, functionSignature } =
            await buyerCoreSDK.signMetaTxCommitToConditionalOffer({
              offerId: offer.id,
              tokenId: tokenID,
              nonce
            });

          const metaTx = await buyerCoreSDK.relayMetaTransaction({
            functionName,
            functionSignature,
            nonce,
            sigR: r,
            sigS: s,
            sigV: v,
            transferAuthorizations: [buyerAuth]
          });
          const metaTxReceipt = await metaTx.wait();
          expect(metaTxReceipt.transactionHash).toBeTruthy();
          expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(
            true
          );
        });
      });
    });

    describe("commitToBuyerOffer", () => {
      STRATEGIES.forEach((strategy) => {
        test(`${strategy} auth — non-native exchange token buyer-initiated offer`, async () => {
          // `commitToBuyerOffer` consumes pre-deposited "available funds" rather
          // than pulling tokens inline (unlike `commitToOffer`). The auth feature
          // is therefore exercised on the `depositFunds` meta-tx that precedes
          // the commit: the auth pulls tokens into the protocol AND the inner
          // `depositFunds` call credits them to the user's account. The commit
          // itself runs as a regular meta-tx, no auths needed.
          const exchangeToken = exchangeTokenFor(strategy);
          const drFeeAmount = parseEther("0.001");

          const disputeResolver = await createDrForToken(
            exchangeToken,
            drFeeAmount
          );

          const {
            sellerCoreSDK: sellerCoreSDKBuyer,
            buyerCoreSDK: buyerCoreSDKBuyer,
            sellerWallet: sellerFundedWallet,
            buyerWallet: buyerFundedWallet
          } = await initSellerAndBuyerSDKs(seedWallet);

          // Buyer-initiated offer with the chosen exchange token.
          // sellerDeposit = 0 so the seller doesn't need to deposit funds upfront.
          const buyerInitiatedOffer = await createOffer(buyerCoreSDKBuyer, {
            creator: OfferCreator.Buyer,
            quantityAvailable: 1,
            disputeResolverId: disputeResolver.id,
            exchangeToken,
            sellerDeposit: "0"
          });

          await setUpFunderWallet(
            buyerFundedWallet,
            strategy,
            buyerInitiatedOffer.price
          );
          await setUpFunderWallet(sellerFundedWallet, strategy, drFeeAmount);

          // Seller account is required so the seller can receive a deposit.
          const seller = await createSeller(
            sellerCoreSDKBuyer,
            sellerFundedWallet.address
          );

          // 1. Buyer: sign auth, then relay a depositFunds meta-tx carrying it.
          //    The auth pulls offer.price into the protocol; the inner deposit
          //    credits it to the buyer's account.
          const buyerAuth = await signAuth(
            buyerCoreSDKBuyer,
            strategy,
            exchangeToken,
            buyerInitiatedOffer.price
          );
          const buyerDepositNonce = Date.now();
          const buyerDepositSig =
            await buyerCoreSDKBuyer.signMetaTxDepositFunds({
              entityId: buyerInitiatedOffer.buyerId,
              fundsTokenAddress: exchangeToken,
              fundsAmount: buyerInitiatedOffer.price,
              nonce: buyerDepositNonce
            });
          const buyerDepositTx = await buyerCoreSDKBuyer.relayMetaTransaction({
            functionName: buyerDepositSig.functionName,
            functionSignature: buyerDepositSig.functionSignature,
            nonce: buyerDepositNonce,
            sigR: buyerDepositSig.r,
            sigS: buyerDepositSig.s,
            sigV: buyerDepositSig.v,
            transferAuthorizations: [buyerAuth]
          });
          await buyerDepositTx.wait();

          // 2. Seller: same pattern for drFeeAmount.
          const sellerAuth = await signAuth(
            sellerCoreSDKBuyer,
            strategy,
            exchangeToken,
            drFeeAmount
          );
          const sellerDepositNonce = Date.now() + 1;
          const sellerDepositSig =
            await sellerCoreSDKBuyer.signMetaTxDepositFunds({
              entityId: seller.id,
              fundsTokenAddress: exchangeToken,
              fundsAmount: drFeeAmount,
              nonce: sellerDepositNonce
            });
          const sellerDepositTx = await sellerCoreSDKBuyer.relayMetaTransaction(
            {
              functionName: sellerDepositSig.functionName,
              functionSignature: sellerDepositSig.functionSignature,
              nonce: sellerDepositNonce,
              sigR: sellerDepositSig.r,
              sigS: sellerDepositSig.s,
              sigV: sellerDepositSig.v,
              transferAuthorizations: [sellerAuth]
            }
          );
          await sellerDepositTx.wait();

          // 3. Seller commits — funds are now available, no auths needed.
          const commitNonce = Date.now() + 2;
          const { r, s, v, functionName, functionSignature } =
            await sellerCoreSDKBuyer.signMetaTxCommitToBuyerOffer({
              offerId: buyerInitiatedOffer.id,
              sellerParams: {},
              nonce: commitNonce
            });

          const metaTx = await sellerCoreSDKBuyer.relayMetaTransaction({
            functionName,
            functionSignature,
            nonce: commitNonce,
            sigR: r,
            sigS: s,
            sigV: v
          });
          const metaTxReceipt = await metaTx.wait();
          expect(metaTxReceipt.transactionHash).toBeTruthy();
          expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(
            true
          );
        });
      });
    });

    describe("createOfferAndCommit", () => {
      STRATEGIES.forEach((strategy) => {
        test(`${strategy} auth — non-native exchange token seller-initiated offer`, async () => {
          const exchangeToken = exchangeTokenFor(strategy);
          const sellerDeposit = "0";
          const drFeeAmount = "0";

          const disputeResolver = await createDrForToken(
            exchangeToken,
            drFeeAmount
          );

          const {
            sellerCoreSDK: sellerCoreSDKNew,
            buyerCoreSDK: buyerCoreSDKNew,
            sellerWallet: sellerFundedWallet,
            buyerWallet: buyerFundedWallet
          } = await initSellerAndBuyerSDKs(seedWallet);

          // Seller is offer creator for seller-initiated offer.
          const seller = await createSeller(
            sellerCoreSDKNew,
            sellerFundedWallet.address
          );

          const fullOfferArgsUnsigned = await buildFullOfferArgs(
            buyerCoreSDKNew, // buyer calls createOfferAndCommit
            sellerCoreSDKNew, // seller signs the offer
            noCondition,
            {
              committer: buyerFundedWallet.address,
              offerCreator: sellerFundedWallet.address,
              sellerId: seller.id,
              sellerOfferParams: {
                collectionIndex: 0,
                mutualizerAddress: constants.AddressZero,
                royaltyInfo: { recipients: [], bps: [] }
              },
              useDepositedFunds: true,
              creator: OfferCreator.Seller,
              feeLimit: parseEther("0.1")
            },
            {
              offerParams: {
                disputeResolverId: disputeResolver.id,
                exchangeToken,
                sellerDeposit
              }
            }
          );

          const { signature } = await sellerCoreSDKNew.signFullOffer({
            fullOfferArgsUnsigned
          });
          const fullOfferArgs: FullOfferArgs = {
            ...fullOfferArgsUnsigned,
            signature
          };

          // Buyer (committer) is the one whose funds get pulled.
          await setUpFunderWallet(
            buyerFundedWallet,
            strategy,
            fullOfferArgsUnsigned.price
          );
          // The seller doesn't actually transfer anything (sellerDeposit=0 and
          // useDepositedFunds=true), but `prepareOfferForCommit` still advances
          // the queue head for the seller-deposit slot, so a signed entry must
          // be supplied there. A zero-amount auth is enough.
          if (strategy === "Permit2") {
            await approvePermit2(sellerFundedWallet);
          }

          const sellerDiscardAuth = await signAuth(
            sellerCoreSDKNew,
            strategy,
            exchangeToken,
            sellerDeposit
          );
          const buyerAuth = await signAuth(
            buyerCoreSDKNew,
            strategy,
            exchangeToken,
            fullOfferArgsUnsigned.price
          );

          const nonce = Date.now();
          const { r, s, v, functionName, functionSignature } =
            await buyerCoreSDKNew.signMetaTxCreateOfferAndCommit({
              createOfferAndCommitArgs: fullOfferArgs,
              nonce
            });

          const metaTx = await buyerCoreSDKNew.relayMetaTransaction({
            functionName,
            functionSignature,
            nonce,
            sigR: r,
            sigS: s,
            sigV: v,
            // Queue layout: [seller-deposit slot (discarded), buyer's price].
            transferAuthorizations: [sellerDiscardAuth, buyerAuth]
          });
          const metaTxReceipt = await metaTx.wait();
          expect(metaTxReceipt.transactionHash).toBeTruthy();
          expect(BigNumber.from(metaTxReceipt.effectiveGasPrice).gt(0)).toBe(
            true
          );
        });
      });
    });
  });
});
