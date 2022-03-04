import { BigNumberish, BigNumber } from "@ethersproject/bignumber";

export function msToSec(ms: BigNumberish) {
  return Math.floor(BigNumber.from(ms).div(1000).toNumber());
}
