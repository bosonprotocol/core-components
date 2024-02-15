import { BigNumber } from "@ethersproject/bignumber";
import { useSingleCallResult } from "../../hooks/uniswap/multicall";
import { useMemo } from "react";

import { useInterfaceMulticall } from "./useContract";

// gets the current timestamp from the blockchain
export function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useInterfaceMulticall();
  const resultStr: string | undefined = useSingleCallResult(
    multicall,
    "getCurrentBlockTimestamp"
  )?.result?.[0]?.toString();
  return useMemo(
    () =>
      typeof resultStr === "string" ? BigNumber.from(resultStr) : undefined,
    [resultStr]
  );
}
