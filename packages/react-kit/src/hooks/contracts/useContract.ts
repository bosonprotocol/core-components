import { Contract } from "@ethersproject/contracts";
import {
  ChainId,
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESSES
} from "@uniswap/sdk-core";
import UniswapInterfaceMulticallJson from "@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json";
import ENS_PUBLIC_RESOLVER_ABI from "../../abis/ens-public-resolver.json";
import ENS_ABI from "../../abis/ens-registrar.json";
import ERC20_ABI from "../../abis/erc20.json";
import ERC20_BYTES32_ABI from "../../abis/erc20_bytes32.json";
import ERC721_ABI from "../../abis/erc721.json";
import ERC1155_ABI from "../../abis/erc1155.json";
import {
  EnsPublicResolver,
  EnsRegistrar,
  Erc20,
  Erc721,
  Erc1155,
  Weth
} from "../../abis/types";
import WETH_ABI from "../../abis/weth.json";
import { getContract } from "./getContract";
import { useMemo } from "react";
import { useChainId, useProvider, useAccount } from "../connection/connection";
import { RPC_PROVIDERS } from "../../lib/const/providers";
import { WRAPPED_NATIVE_CURRENCY } from "../../lib/const/tokens";
import { UniswapInterfaceMulticall } from "../../types/v3/UniswapInterfaceMulticall";

const { abi: MulticallABI } = UniswapInterfaceMulticallJson;

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const chainId = useChainId();
  const provider = useProvider();
  const { address: account } = useAccount();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        // TODO: check
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    provider,
    chainId,
    withSignerIfPossible,
    account
  ]) as T;
}

function useMainnetContract<T extends Contract = Contract>(
  address: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ABI: any
): T | null {
  const chainId = useChainId();
  const isMainnet = chainId === ChainId.MAINNET;
  const contract = useContract(isMainnet ? address : undefined, ABI, false);
  return useMemo(() => {
    if (isMainnet) return contract;
    if (!address) return null;
    const provider = RPC_PROVIDERS[ChainId.MAINNET];
    try {
      return getContract(address, ABI, provider);
    } catch (error) {
      console.error("Failed to get mainnet contract", error);
      return null;
    }
  }, [address, ABI, contract, isMainnet]) as T;
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const chainId = useChainId();
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_CURRENCY[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useERC721Contract(nftAddress?: string) {
  return useContract<Erc721>(nftAddress, ERC721_ABI, false);
}

export function useERC1155Contract(nftAddress?: string) {
  return useContract<Erc1155>(nftAddress, ERC1155_ABI, false);
}

export function useENSRegistrarContract() {
  return useMainnetContract<EnsRegistrar>(
    ENS_REGISTRAR_ADDRESSES[ChainId.MAINNET],
    ENS_ABI
  );
}

export function useENSResolverContract(address: string | undefined) {
  return useMainnetContract<EnsPublicResolver>(
    address,
    ENS_PUBLIC_RESOLVER_ABI
  );
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(
    MULTICALL_ADDRESSES,
    MulticallABI,
    false
  ) as UniswapInterfaceMulticall;
}

export function useMainnetInterfaceMulticall() {
  return useMainnetContract<UniswapInterfaceMulticall>(
    MULTICALL_ADDRESSES[ChainId.MAINNET],
    MulticallABI
  ) as UniswapInterfaceMulticall;
}
