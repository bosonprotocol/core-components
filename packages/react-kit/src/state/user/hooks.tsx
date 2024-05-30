import { Percent, Token, V2_FACTORY_ADDRESSES } from "@uniswap/sdk-core";
import { computePairAddress, Pair } from "@uniswap/v2-sdk";
import JSBI from "jsbi";
import { AppState } from "../reducer";
import {
  addSerializedPair,
  addSerializedToken,
  updateHideBaseWalletBanner,
  updateHideClosedPositions,
  updateUserDeadline,
  updateUserLocale,
  updateUserRouterPreference,
  updateUserSlippageTolerance
} from "./reducer";
import { SerializedPair, SerializedToken, SlippageTolerance } from "./types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { SupportedLocale } from "../../lib/const/locales";
import { useCallback, useMemo } from "react";
import { RouterPreference } from "../routing/types";
import { useChainId } from "../../hooks/connection/connection";
import { L2_CHAIN_IDS } from "../../lib/const/chains";
import { L2_DEADLINE_FROM_NOW } from "../../lib/const/misc";
import { UserAddedToken } from "../../types/tokens";

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  };
}

export function deserializeToken(
  serializedToken: SerializedToken,
  Class: typeof Token = Token
): Token {
  return new Class(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  );
}

export function useUserLocale(): SupportedLocale | null {
  return useAppSelector((state) => state.user.userLocale);
}

export function useUserLocaleManager(): [
  SupportedLocale | null,
  (newLocale: SupportedLocale) => void
] {
  const dispatch = useAppDispatch();
  const locale = useUserLocale();

  const setLocale = useCallback(
    (newLocale: SupportedLocale) => {
      dispatch(updateUserLocale({ userLocale: newLocale }));
    },
    [dispatch]
  );

  return [locale, setLocale];
}

export function useRouterPreference(): [
  RouterPreference,
  (routerPreference: RouterPreference) => void
] {
  const dispatch = useAppDispatch();

  const routerPreference = useAppSelector(
    (state) => state.user.userRouterPreference
  );

  const setRouterPreference = useCallback(
    (newRouterPreference: RouterPreference) => {
      dispatch(
        updateUserRouterPreference({
          userRouterPreference: newRouterPreference
        })
      );
    },
    [dispatch]
  );

  return [routerPreference, setRouterPreference];
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): [
  Percent | SlippageTolerance.Auto,
  (slippageTolerance: Percent | SlippageTolerance.Auto) => void
] {
  const userSlippageToleranceRaw = useAppSelector((state) => {
    return state.user.userSlippageTolerance;
  });

  // TODO(WEB-1985): Keep `userSlippageTolerance` as Percent in Redux store and remove this conversion
  const userSlippageTolerance = useMemo(
    () =>
      userSlippageToleranceRaw === SlippageTolerance.Auto
        ? SlippageTolerance.Auto
        : new Percent(userSlippageToleranceRaw, 10_000),
    [userSlippageToleranceRaw]
  );

  const dispatch = useAppDispatch();
  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: Percent | SlippageTolerance.Auto) => {
      let value: SlippageTolerance.Auto | number;
      try {
        value =
          userSlippageTolerance === SlippageTolerance.Auto
            ? SlippageTolerance.Auto
            : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient);
      } catch (error) {
        value = SlippageTolerance.Auto;
      }
      dispatch(
        updateUserSlippageTolerance({
          userSlippageTolerance: value
        })
      );
    },
    [dispatch]
  );

  return [userSlippageTolerance, setUserSlippageTolerance];
}

/**
 *Returns user slippage tolerance, replacing the auto with a default value
 * @param defaultSlippageTolerance the value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(
  defaultSlippageTolerance: Percent
): Percent {
  const [allowedSlippage] = useUserSlippageTolerance();
  return allowedSlippage === SlippageTolerance.Auto
    ? defaultSlippageTolerance
    : allowedSlippage;
}

export function useUserHideClosedPositions(): [
  boolean,
  (newHideClosedPositions: boolean) => void
] {
  const dispatch = useAppDispatch();

  const hideClosedPositions = useAppSelector(
    (state) => state.user.userHideClosedPositions
  );

  const setHideClosedPositions = useCallback(
    (newHideClosedPositions: boolean) => {
      dispatch(
        updateHideClosedPositions({
          userHideClosedPositions: newHideClosedPositions
        })
      );
    },
    [dispatch]
  );

  return [hideClosedPositions, setHideClosedPositions];
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const chainId = useChainId();
  const dispatch = useAppDispatch();
  const userDeadline = useAppSelector((state) => state.user.userDeadline);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onL2 = Boolean(chainId && L2_CHAIN_IDS.includes(chainId));
  const deadline = onL2 ? L2_DEADLINE_FROM_NOW : userDeadline;

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch]
  );

  return [deadline, setUserDeadline];
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }));
    },
    [dispatch]
  );
}

function useUserAddedTokensOnChain(
  chainId: number | undefined | null
): Token[] {
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    const tokenMap: Token[] = serializedTokensMap?.[chainId]
      ? Object.values(serializedTokensMap[chainId]).map((value) =>
          deserializeToken(value, UserAddedToken)
        )
      : [];
    return tokenMap;
  }, [serializedTokensMap, chainId]);
}

export function useUserAddedTokens(): Token[] {
  return useUserAddedTokensOnChain(useChainId());
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1)
  };
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }));
    },
    [dispatch]
  );
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible);
}

export function useHideBaseWalletBanner(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const hideBaseWalletBanner = useAppSelector(
    (state) => state.user.hideBaseWalletBanner
  );

  const toggleHideBaseWalletBanner = useCallback(() => {
    dispatch(updateHideBaseWalletBanner({ hideBaseWalletBanner: true }));
  }, [dispatch]);

  return [hideBaseWalletBanner, toggleHideBaseWalletBanner];
}

export function useUserDisabledUniswapX(): boolean {
  return useAppSelector((state) => state.user.disabledUniswapX) ?? false;
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  if (tokenA.chainId !== tokenB.chainId)
    throw new Error("Not matching chain IDs");
  if (tokenA.equals(tokenB)) throw new Error("Tokens cannot be equal");
  if (!V2_FACTORY_ADDRESSES[tokenA.chainId])
    throw new Error("No V2 factory address on this chain");

  return new Token(
    tokenA.chainId,
    computePairAddress({
      factoryAddress: V2_FACTORY_ADDRESSES[tokenA.chainId],
      tokenA,
      tokenB
    }),
    18,
    "UNI-V2",
    "Uniswap V2"
  );
}
