import { subgraph } from "@bosonprotocol/core-sdk";
import { BigNumber, BigNumberish } from "ethers";

export function getMinimalFundsAmountNeeded(args: {
  seller: subgraph.SellerFieldsFragment;
  sellerDeposit: BigNumberish;
  exchangeToken: string;
  quantity: BigNumberish;
}) {
  const allFunds = args.seller.funds || [];
  const exchangeTokenFunds = allFunds.find(
    (funds) =>
      funds.token.address.toLowerCase() === args.exchangeToken.toLowerCase()
  );
  const minimalFundsAmountNeeded = BigNumber.from(args.sellerDeposit).mul(
    args.quantity
  );

  if (!exchangeTokenFunds) {
    return minimalFundsAmountNeeded;
  }

  return BigNumber.from(minimalFundsAmountNeeded).sub(
    exchangeTokenFunds.availableAmount
  );
}
