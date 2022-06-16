import { subgraph } from "@bosonprotocol/core-sdk";
import { BigNumber, BigNumberish } from "ethers";

export function getMinimalFundsAmountNeeded(args: {
  seller: subgraph.SellerFieldsFragment;
  sellerDeposit: BigNumberish;
  exchangeToken: string;
  quantity: BigNumberish;
}) {
  const availableFunds = getAvailableFundsOfSeller(
    args.seller,
    args.exchangeToken
  );
  const minimalFundsAmountNeededForOffer = BigNumber.from(
    args.sellerDeposit
  ).mul(args.quantity);

  if (parseInt(availableFunds) === 0) {
    return minimalFundsAmountNeededForOffer;
  }

  const delta = BigNumber.from(minimalFundsAmountNeededForOffer).sub(
    BigNumber.from(availableFunds)
  );

  return delta.isNegative() ? BigNumber.from(0) : delta;
}

export function getAvailableFundsOfSeller(
  seller: subgraph.SellerFieldsFragment,
  exchangeToken: string
) {
  const allFunds = seller.funds || [];
  const exchangeTokenFunds = allFunds.find(
    (funds) => funds.token.address.toLowerCase() === exchangeToken.toLowerCase()
  );
  return exchangeTokenFunds ? exchangeTokenFunds.availableAmount : "0";
}
