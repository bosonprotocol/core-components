import { accounts } from "@bosonprotocol/core-sdk";
import { BigNumber, BigNumberish } from "ethers";

export function getMinimalFundsAmountNeeded(
  seller: accounts.RawSellerFromSubgraph,
  sellerDeposit: BigNumberish,
  exchangeToken: string
) {
  const allFunds = seller.funds || [];
  const exchangeTokenFunds = allFunds.find(
    (funds) => funds.token.address.toLowerCase() === exchangeToken.toLowerCase()
  );

  if (!exchangeTokenFunds) {
    return BigNumber.from(sellerDeposit);
  }

  return BigNumber.from(sellerDeposit).sub(exchangeTokenFunds.availableAmount);
}
