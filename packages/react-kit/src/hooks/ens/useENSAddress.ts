import { useMemo } from "react";
import { safeNamehash } from "@bosonprotocol/utils";
import { useDebounce } from "../useDebounce";
import {
  useENSRegistrarContract,
  useENSResolverContract
} from "../contracts/useContract";
import { isZero } from "@bosonprotocol/utils";
import {
  NEVER_RELOAD,
  useMainnetSingleCallResult
} from "../contracts/multicall";

/*
 * Does a lookup for an ENS name to find its address.
 */
export default function useENSAddress(ensName?: string | null): {
  loading: boolean;
  address: string | null;
} {
  const debouncedName = useDebounce(ensName, 200);
  const ensNodeArgument = useMemo(
    () => [debouncedName ? safeNamehash(debouncedName) : undefined],
    [debouncedName]
  );
  const registrarContract = useENSRegistrarContract();
  const resolverAddress = useMainnetSingleCallResult(
    registrarContract,
    "resolver",
    ensNodeArgument,
    NEVER_RELOAD
  );
  const resolverAddressResult = resolverAddress.result?.[0];
  const resolverContract = useENSResolverContract(
    resolverAddressResult && !isZero(resolverAddressResult)
      ? resolverAddressResult
      : undefined
  );
  const addr = useMainnetSingleCallResult(
    resolverContract,
    "addr",
    ensNodeArgument,
    NEVER_RELOAD
  );

  const changed = debouncedName !== ensName;
  return useMemo(
    () => ({
      address: changed ? null : (addr.result?.[0] ?? null),
      loading: changed || resolverAddress.loading || addr.loading
    }),
    [addr.loading, addr.result, changed, resolverAddress.loading]
  );
}
