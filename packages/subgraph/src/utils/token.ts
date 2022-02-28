import { Address } from "@graphprotocol/graph-ts";
import { ExchangeToken } from "../../generated/schema";

export function saveExchangeToken(exchangeTokenAddress: Address): void {
  let exchangeToken = ExchangeToken.load(exchangeTokenAddress.toHexString());

  if (exchangeToken === null) {
    exchangeToken = new ExchangeToken(exchangeTokenAddress.toHexString());
    exchangeToken.address = exchangeTokenAddress;
    exchangeToken.save();
  }
}
