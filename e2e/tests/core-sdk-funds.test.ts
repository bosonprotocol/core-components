import { utils, constants, BigNumber } from "ethers";
import { parseEther } from "@ethersproject/units";
import { CoreSDK } from "../../packages/core-sdk/src";
import { FundsEntityFieldsFragment } from "../../packages/core-sdk/src/subgraph";

import {
  initCoreSDKWithFundedWallet,
  ensureCreatedSeller,
  ensureMintedAndAllowedTokens,
  MOCK_ERC20_ADDRESS,
  waitForGraphNodeIndexing,
  seedWallet19,
  createOffer,
  initSellerAndBuyerSDKs,
  commitToOffer,
  mockErc20Contract
} from "./utils";

const seedWallet = seedWallet19; // be sure the seedWallet is not used by another test (to allow concurrent run)

jest.setTimeout(800_000);

describe("core-sdk-funds", () => {
  describe("deposit funds", () => {
    test("ETH", async () => {
      const sellerFundsDepositInEth = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );
      const sellers = await ensureCreatedSeller(fundedWallet);
      const [seller] = sellers;

      const funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: seller.id
      });

      expect(funds).toBeTruthy();
      expect(funds.availableAmount).toBe(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );
      expect(funds.token.symbol.toUpperCase()).toBe("ETH");
    });

    test("ERC20", async () => {
      const sellerFundsDeposit = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );
      const sellers = await ensureCreatedSeller(fundedWallet);
      const [seller] = sellers;

      await ensureMintedAndAllowedTokens([fundedWallet], sellerFundsDeposit);

      const funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDeposit,
        sellerId: seller.id,
        fundsTokenAddress: MOCK_ERC20_ADDRESS
      });

      expect(funds).toBeTruthy();
      expect(funds.availableAmount).toBe(
        utils.parseEther(sellerFundsDeposit).toString()
      );
      expect(funds.token.symbol.toUpperCase()).toBe("20TEST");
    });
  });

  describe("withdraw funds", () => {
    test("ETH", async () => {
      const sellerFundsDepositInEth = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );
      const sellers = await ensureCreatedSeller(fundedWallet);
      const [seller] = sellers;

      const funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: seller.id
      });
      expect(funds.availableAmount).toEqual(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );

      const tokenAddress = funds.token.address;

      const updatedFunds = await withdrawFunds({
        coreSDK,
        sellerId: seller.id,
        tokenAddresses: [tokenAddress],
        amountsInEth: [sellerFundsDepositInEth]
      });

      expect(updatedFunds[0].availableAmount).toEqual("0");
    });

    test("ETH and ERC20", async () => {
      const sellerFundsDepositInEth = "5";
      const { coreSDK, fundedWallet } = await initCoreSDKWithFundedWallet(
        seedWallet
      );
      const sellers = await ensureCreatedSeller(fundedWallet);
      const [seller] = sellers;

      const ethFunds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: seller.id,
        fundsTokenAddress: constants.AddressZero
      });
      expect(ethFunds.availableAmount).toEqual(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );

      await ensureMintedAndAllowedTokens(
        [fundedWallet],
        sellerFundsDepositInEth
      );

      const mockErc20Funds = await depositFunds({
        coreSDK,
        fundsDepositAmountInEth: sellerFundsDepositInEth,
        sellerId: seller.id,
        fundsTokenAddress: MOCK_ERC20_ADDRESS
      });

      expect(mockErc20Funds.availableAmount).toEqual(
        utils.parseEther(sellerFundsDepositInEth).toString()
      );

      const updatedFunds = await withdrawFunds({
        coreSDK,
        sellerId: seller.id,
        tokenAddresses: [constants.AddressZero, MOCK_ERC20_ADDRESS],
        amountsInEth: [sellerFundsDepositInEth, sellerFundsDepositInEth]
      });

      const ethFundsAvailable = updatedFunds.find(
        (fund) => fund.token.address === constants.AddressZero
      )?.availableAmount;
      const mockErc20FundsAvailable = updatedFunds.find(
        (fund) =>
          fund.token.address.toLowerCase() === MOCK_ERC20_ADDRESS.toLowerCase()
      )?.availableAmount;
      expect(ethFundsAvailable).toEqual("0");
      expect(mockErc20FundsAvailable).toEqual("0");
    });
  });

  describe("locked funds", () => {
    test("completed exchanges should be excluded when computing the locked funds value", async () => {
      const { sellerCoreSDK, buyerCoreSDK, sellerWallet, buyerWallet } =
        await initSellerAndBuyerSDKs(seedWallet);
      const sellers = await ensureCreatedSeller(sellerWallet);

      const tokenAddress = mockErc20Contract.address;
      const getErc20Balance = async (account: string) =>
        await sellerCoreSDK.erc20BalanceOf({
          contractAddress: tokenAddress,
          owner: account
        });

      const price = parseEther("1");
      const sellerDeposit = parseEther("0.1");
      const buyerCancelPenalty = parseEther("0.01");
      const protocolFee = parseEther("0.005");
      const quantityAvailable = 5;
      await ensureMintedAndAllowedTokens([sellerWallet], 100);
      await ensureMintedAndAllowedTokens([buyerWallet], 100);

      const [seller] = sellers;

      await (
        await sellerCoreSDK.depositFunds(
          seller.id,
          sellerDeposit.mul(quantityAvailable),
          tokenAddress
        )
      ).wait();
      const offer1 = await createOffer(sellerCoreSDK, {
        quantityAvailable,
        price,
        sellerDeposit,
        buyerCancelPenalty,
        exchangeToken: tokenAddress
      });

      const buyerErc20BalanceBefore = await getErc20Balance(
        buyerWallet.address
      );

      const ex1 = await commitToOffer({
        offerId: offer1.id,
        buyerCoreSDK,
        sellerCoreSDK
      });
      await waitForGraphNodeIndexing();
      const [buyer] = await buyerCoreSDK.getBuyers({
        buyersFilter: {
          wallet: buyerWallet.address
        }
      });
      const ex2 = await commitToOffer({
        offerId: offer1.id,
        buyerCoreSDK,
        sellerCoreSDK
      });
      await waitForGraphNodeIndexing();
      const ex3 = await commitToOffer({
        offerId: offer1.id,
        buyerCoreSDK,
        sellerCoreSDK
      });
      await waitForGraphNodeIndexing();

      const ex4 = await commitToOffer({
        offerId: offer1.id,
        buyerCoreSDK,
        sellerCoreSDK
      });
      await waitForGraphNodeIndexing();

      const ex5 = await commitToOffer({
        offerId: offer1.id,
        buyerCoreSDK,
        sellerCoreSDK
      });

      await (await buyerCoreSDK.cancelVoucher(ex1.id)).wait();
      await (await buyerCoreSDK.redeemVoucher(ex2.id)).wait();
      await (await buyerCoreSDK.redeemVoucher(ex3.id)).wait();
      await (await buyerCoreSDK.raiseDispute(ex3.id)).wait();
      await (await buyerCoreSDK.redeemVoucher(ex4.id)).wait();
      await (await buyerCoreSDK.completeExchange(ex4.id)).wait();
      await (await sellerCoreSDK.revokeVoucher(ex5.id)).wait();
      await waitForGraphNodeIndexing();

      const sellerFundsAfter = await sellerCoreSDK.getFunds({
        fundsFilter: {
          account: seller.id
        }
      });
      const buyerFundsAfter = await sellerCoreSDK.getFunds({
        fundsFilter: {
          account: buyer.id
        }
      });
      const firstSeller = await sellerCoreSDK.getSellerById(seller.id, {
        includeExchanges: true
      });
      const offers = await sellerCoreSDK.getExchanges({
        exchangesFilter: {
          id_in: firstSeller.exchanges
            ?.filter((e) => !e.finalizedDate)
            .map((e) => e.id)
        }
      });
      const lockedSellerDeposit = offers
        .map((o) => o.offer.sellerDeposit)
        .reduce((prev, current) => prev.add(current), BigNumber.from(0));
      const lockedBuyerPrice = offers
        .map((o) => o.offer.price)
        .reduce((prev, current) => prev.add(current), BigNumber.from(0));

      expect(sellerFundsAfter[0].availableAmount).toBe(
        sellerDeposit
          .mul(quantityAvailable) // initial deposit
          .add(buyerCancelPenalty) // cancel ex1
          .sub(sellerDeposit) // commit ex2
          .sub(sellerDeposit) // commit ex3
          .add(price.sub(protocolFee)) // ex4 complete
          .sub(sellerDeposit)
          .toString()
      );
      expect(await getErc20Balance(buyerWallet.address)).toBe(
        BigNumber.from(buyerErc20BalanceBefore)
          .sub(price.mul(quantityAvailable)) // commits
          .toString()
      );
      expect(buyerFundsAfter[0].availableAmount).toBe(
        price
          .sub(buyerCancelPenalty) // cancel ex1
          .add(price.add(sellerDeposit)) // ex5 revoke
          .toString()
      );
      expect(lockedSellerDeposit.toString()).toBe(
        sellerDeposit.add(sellerDeposit).toString() // ex2 & ex3
      );
      expect(lockedBuyerPrice.toString()).toBe(
        price.add(price).toString() // ex2 & ex3
      );
    });
  });
});

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
