import { utils, constants, BigNumberish, Contract, Wallet } from "ethers";
import { TransactionReceipt } from "../../packages/common/src/types";

import {
  ADDRESS,
  mockCreateOfferArgs
} from "../../packages/common/tests/mocks";
import { CoreSDK, getDefaultConfig } from "../../packages/core-sdk/src";
import {
  ExchangeState,
  FundsEntityFieldsFragment,
  OfferFieldsFragment
} from "../../packages/core-sdk/src/subgraph";
import { contracts } from "../../packages/ethers-sdk/src";

import {
  initCoreSDKWithFundedWallet,
  initSellerAndBuyerSDKs,
  metadata,
  provider,
  setHolderBalanceAbi,
  waitForGraphNodeIndexing
} from "./utils";

jest.setTimeout(60_000);

const mockERC20TokenAddress = "0x95401dc811bb5740090279Ba06cfA8fcF6113778";

describe("core-sdk", () => {
  describe("core user flows", () => {
    test("create seller + offer", async () => {
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();

      const createdOffer = await createSellerAndOffer(
        coreSDK,
        fundedWallet.address
      );

      expect(createdOffer).toBeTruthy();
      expect(createdOffer.metadata).toMatchObject(metadata);
      expect(createdOffer.seller).toBeTruthy();
      expect(createdOffer.seller.operator.toLowerCase()).toBe(
        fundedWallet.address.toLowerCase()
      );
    });

    describe("deposit funds", () => {
      test("ETH", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
        const createdOffer = await createSellerAndOffer(
          coreSDK,
          fundedWallet.address
        );

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: createdOffer.seller.id
        });

        expect(funds).toBeTruthy();
        expect(funds.availableAmount).toBe(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );
        expect(funds.token.symbol.toUpperCase()).toBe("ETH");
      });

      test("ERC20", async () => {
        const sellerFundsDeposit = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
        const createdOffer = await createSellerAndOffer(
          coreSDK,
          fundedWallet.address
        );

        await fundWalletWithMockToken({
          wallet: fundedWallet,
          coreSDK: coreSDK,
          amount: utils.parseEther(sellerFundsDeposit)
        });

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDeposit,
          sellerId: createdOffer.seller.id,
          fundsTokenAddress: mockERC20TokenAddress
        });

        expect(funds).toBeTruthy();
        expect(funds.availableAmount).toBe(
          utils.parseEther(sellerFundsDeposit).toString()
        );
        expect(funds.token.symbol.toUpperCase()).toBe("20TEST");
      });
    });

    test("commit", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });

      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      expect(exchange).toBeTruthy();
    });

    test("revoke", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await sellerCoreSDK.revokeVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await sellerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Revoked);
      expect(exchangeAfterRevoke.revokedDate).toBeTruthy();
    });

    test("cancel", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.cancelVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Cancelled);
      expect(exchangeAfterRevoke.cancelledDate).toBeTruthy();
    });

    test("redeem", async () => {
      const { sellerCoreSDK, sellerWallet, buyerCoreSDK } =
        await initSellerAndBuyerSDKs();
      const createdOffer = await createSellerAndOffer(
        sellerCoreSDK,
        sellerWallet.address
      );
      await depositFunds({
        coreSDK: sellerCoreSDK,
        sellerId: createdOffer.seller.id
      });
      const exchange = await commitToOffer({
        buyerCoreSDK,
        sellerCoreSDK,
        offerId: createdOffer.id
      });

      const txResponse = await buyerCoreSDK.redeemVoucher(exchange.id);
      await txResponse.wait();
      await waitForGraphNodeIndexing();
      const exchangeAfterRevoke = await buyerCoreSDK.getExchangeById(
        exchange.id
      );

      expect(exchangeAfterRevoke.state).toBe(ExchangeState.Redeemed);
      expect(exchangeAfterRevoke.redeemedDate).toBeTruthy();
    });

    describe("withdraw funds", () => {
      test("ETH", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
        const createdOffer = await createSellerAndOffer(
          coreSDK,
          fundedWallet.address
        );

        const funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: createdOffer.seller.id
        });
        expect(funds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        const tokenAddress = funds.token.address;

        const updatedFunds = await withdrawFunds({
          coreSDK,
          sellerId: createdOffer.seller.id,
          tokenAddresses: [tokenAddress],
          amountsInEth: [sellerFundsDepositInEth]
        });

        expect(updatedFunds[0].availableAmount).toEqual("0");
      });

      test("ETH and ERC20", async () => {
        const sellerFundsDepositInEth = "5";
        const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet();
        const createdOffer = await createSellerAndOffer(
          coreSDK,
          fundedWallet.address
        );

        const ethFunds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: createdOffer.seller.id,
          fundsTokenAddress: constants.AddressZero
        });
        expect(ethFunds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        await fundWalletWithMockToken({
          wallet: fundedWallet,
          coreSDK: coreSDK,
          amount: utils.parseEther(sellerFundsDepositInEth)
        });

        const mockErc20Funds = await depositFunds({
          coreSDK,
          fundsDepositAmountInEth: sellerFundsDepositInEth,
          sellerId: createdOffer.seller.id,
          fundsTokenAddress: mockERC20TokenAddress
        });

        expect(mockErc20Funds.availableAmount).toEqual(
          utils.parseEther(sellerFundsDepositInEth).toString()
        );

        const updatedFunds = await withdrawFunds({
          coreSDK,
          sellerId: createdOffer.seller.id,
          tokenAddresses: [constants.AddressZero, mockERC20TokenAddress],
          amountsInEth: [sellerFundsDepositInEth, sellerFundsDepositInEth]
        });

        const ethFundsAvailable = updatedFunds.find(
          (fund) => fund.token.address === constants.AddressZero
        )?.availableAmount;
        const mockErc20FundsAvailable = updatedFunds.find(
          (fund) =>
            fund.token.address.toLowerCase() ===
            mockERC20TokenAddress.toLowerCase()
        )?.availableAmount;
        expect(ethFundsAvailable).toEqual("0");
        expect(mockErc20FundsAvailable).toEqual("0");
      });
    });
  });
});

async function createSellerAndOffer(coreSDK: CoreSDK, sellerAddress: string) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE"
  });
  const metadataUri = "ipfs://" + metadataHash;

  const createOfferTxResponse = await coreSDK.createSellerAndOffer(
    {
      operator: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      treasury: sellerAddress
    },
    mockCreateOfferArgs({
      metadataHash,
      metadataUri
    })
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

async function depositFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  fundsDepositAmountInEth?: string;
  fundsTokenAddress?: string;
}): Promise<FundsEntityFieldsFragment> {
  const tokenAddress = args.fundsTokenAddress ?? constants.AddressZero;
  const depositFundsTxResponse = await args.coreSDK.depositFunds(
    args.sellerId,
    utils.parseEther(args.fundsDepositAmountInEth || "5"),
    tokenAddress
  );
  await depositFundsTxResponse.wait();

  await waitForGraphNodeIndexing();

  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId
    }
  });

  const depositedFunds = funds.find(
    (x) => x.token.address.toLowerCase() === tokenAddress.toLowerCase()
  );
  if (!depositedFunds) throw new Error(`No funds found for ${tokenAddress}`);

  return depositedFunds;
}

async function withdrawFunds(args: {
  coreSDK: CoreSDK;
  sellerId: string;
  tokenAddresses: Array<string>;
  amountsInEth: Array<string>;
}): Promise<Array<FundsEntityFieldsFragment>> {
  const withdrawResponse = await args.coreSDK.withdrawFunds(
    args.sellerId,
    args.tokenAddresses,
    args.amountsInEth.map((amount) => utils.parseEther(amount))
  );
  await withdrawResponse.wait();
  await waitForGraphNodeIndexing();

  const funds = await args.coreSDK.getFunds({
    fundsFilter: {
      accountId: args.sellerId
    }
  });

  return funds;
}

async function commitToOffer(args: {
  buyerCoreSDK: CoreSDK;
  sellerCoreSDK: CoreSDK;
  offerId: BigNumberish;
}) {
  const commitToOfferTxResponse = await args.buyerCoreSDK.commitToOffer(
    args.offerId
  );
  const commitToOfferTxReceipt = await commitToOfferTxResponse.wait();
  const exchangeId = args.buyerCoreSDK.getCommittedExchangeIdFromLogs(
    commitToOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const exchange = await args.sellerCoreSDK.getExchangeById(
    exchangeId as string
  );
  return exchange;
}

async function fundWalletWithMockToken(args: {
  wallet: Wallet;
  coreSDK: CoreSDK;
  amount: BigNumberish;
}) {
  const signer = args.wallet.connect(provider);
  const address = signer.address;

  const mockTokenContract = new Contract(
    mockERC20TokenAddress,
    setHolderBalanceAbi,
    signer
  );
  const approveTokenTx = await mockTokenContract.approve(address, args.amount);
  await approveTokenTx.wait();

  const approveProtocolTx = await args.coreSDK.approveExchangeToken(
    mockERC20TokenAddress,
    args.amount
  );
  await approveProtocolTx.wait();

  const mintMockTokensTx = await mockTokenContract.mint(address, args.amount);
  await mintMockTokensTx.wait();
}
