import { Currency, CurrencyAmount, Token } from "@uniswap/sdk-core";
import JSBI from "jsbi";
import { useMemo } from "react";
import { useChainId } from "../connection/connection";
import { useInterfaceMulticall } from "../contracts/useContract";
import { isAddress } from "../../lib/address/address";
import { useSingleContractMultipleData } from "../contracts/multicall";
import { nativeOnChain } from "../../lib/const/tokens";
import { useTokenBalances as useTokenBalancesSDK } from "../contracts/useTokenBalances";

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useNativeCurrencyBalances(
  uncheckedAddresses?: (string | undefined)[]
): {
  [address: string]: CurrencyAmount<Currency> | undefined;
} {
  const chainId = useChainId();
  const multicallContract = useInterfaceMulticall();

  const validAddressInputs: [string][] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
            .map((addr) => [addr])
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    validAddressInputs
  );

  return useMemo(
    () =>
      validAddressInputs.reduce<{
        [address: string]: CurrencyAmount<Currency>;
      }>((memo, [address], i) => {
        const value = results?.[i]?.result?.[0];
        if (value && chainId)
          memo[address] = CurrencyAmount.fromRawAmount(
            nativeOnChain(chainId),
            JSBI.BigInt(value.toString())
          );
        return memo;
      }, {}),
    [validAddressInputs, chainId, results]
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  chainId: number | undefined, // we cannot fetch balances cross-chain
  address?: string,
  tokens?: (Token | undefined)[]
): readonly [
  { [tokenAddress: string]: CurrencyAmount<Token> | undefined },
  boolean
] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token =>
          isAddress(t?.address) !== false && t?.chainId === chainId
      ) ?? [],
    [chainId, tokens]
  );

  const balances = useTokenBalancesSDK({
    chainId,
    address,
    tokens: validatedTokens.map((t) => {
      return {
        symbol: t.symbol || "",
        name: t.name || "",
        address: t.address,
        decimals: t.decimals.toString()
      };
    })
  });

  const anyLoading: boolean = useMemo(() => balances.isLoading, [balances]);

  const result = useMemo(
    () =>
      [
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: CurrencyAmount<Token> | undefined;
            }>((memo, token, i) => {
              const value = balances?.data?.[i]?.balance;
              const amount = value ? JSBI.BigInt(value) : undefined;
              if (amount) {
                memo[token.address] = CurrencyAmount.fromRawAmount(
                  token,
                  amount
                );
              }
              return memo;
            }, {})
          : {},
        anyLoading
      ] as const,
    [address, validatedTokens, anyLoading, balances]
  );

  return result;
}

export function useTokenBalances(
  chainId: number | undefined,
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(chainId, address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  chainId: number | undefined,
  account?: string,
  token?: Token
): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    chainId,
    account,
    useMemo(() => [token], [token])
  );
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency?.isToken ?? false
      ) ?? [],
    [currencies]
  );

  const chainId = useChainId();
  const tokenBalances = useTokenBalances(chainId, account, tokens);
  const containsETH: boolean = useMemo(
    () => currencies?.some((currency) => currency?.isNative) ?? false,
    [currencies]
  );
  const ethBalance = useNativeCurrencyBalances(
    useMemo(() => (containsETH ? [account] : []), [containsETH, account])
  );

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chainId)
          return undefined;
        if (currency.isToken) return tokenBalances[currency.address];
        if (currency.isNative) return ethBalance[account];
        return undefined;
      }) ?? [],
    [account, chainId, currencies, ethBalance, tokenBalances]
  );
}

export default function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0];
}
