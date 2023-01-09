import { BigNumberish, BigNumber } from "@ethersproject/bignumber";

export const HOURS_PER_DAY = 24;
export const MIN_PER_HOUR = 60;
export const SEC_PER_MIN = 60;
export const MSEC_PER_SEC = 1000;
export const SEC_PER_HOUR = SEC_PER_MIN * MIN_PER_HOUR;
export const SEC_PER_DAY = SEC_PER_HOUR * HOURS_PER_DAY;
export const MSEC_PER_MIN = SEC_PER_MIN * MSEC_PER_SEC;
export const MSEC_PER_HOUR = MIN_PER_HOUR * MSEC_PER_MIN;
export const MSEC_PER_DAY = HOURS_PER_DAY * MSEC_PER_HOUR;

export function msToSec(ms: BigNumberish) {
  return Math.floor(BigNumber.from(ms).div(1000).toNumber());
}
