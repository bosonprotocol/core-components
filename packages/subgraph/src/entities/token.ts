/* eslint-disable prefer-const */
import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/BosonOfferHandler/ERC20";
import { ERC20SymbolBytes } from "../../generated/BosonOfferHandler/ERC20SymbolBytes";
import { ERC20NameBytes } from "../../generated/BosonOfferHandler/ERC20NameBytes";
import { ExchangeToken } from "../../generated/schema";

export function saveExchangeToken(exchangeTokenAddress: Address): void {
  let exchangeToken = ExchangeToken.load(exchangeTokenAddress.toHexString());

  if (!exchangeToken) {
    exchangeToken = new ExchangeToken(exchangeTokenAddress.toHexString());
    exchangeToken.address = exchangeTokenAddress;

    // ZERO_ADDRESS implies native currency
    if (isZeroAddress(exchangeTokenAddress.toHexString())) {
      const networkName = dataSource.network();

      exchangeToken.decimals = BigInt.fromI32(18);
      if (["mumbai", "maticmum", "polygon", "matic"].includes(networkName)) {
        exchangeToken.name = "Matic";
        exchangeToken.symbol = "MATIC";
      } else {
        exchangeToken.name = "Ether";
        exchangeToken.symbol = "ETH";
      }
    } else {
      exchangeToken.decimals = fetchTokenDecimals(exchangeTokenAddress);
      exchangeToken.name = fetchTokenName(exchangeTokenAddress);
      exchangeToken.symbol = fetchTokenSymbol(exchangeTokenAddress);
    }

    exchangeToken.save();
  }
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  const contract = ERC20.bind(tokenAddress);
  const contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  // try types string and bytes32 for symbol
  let symbolValue = "unknown";
  const symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  const contract = ERC20.bind(tokenAddress);
  const contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  // try types string and bytes32 for name
  let nameValue = "unknown";
  const nameResult = contract.try_name();
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  // try types uint8 for decimals
  let decimalValue = 0;
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }

  return BigInt.fromI32(decimalValue);
}

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export function isZeroAddress(value: string): boolean {
  return value == "0x0000000000000000000000000000000000000000";
}
