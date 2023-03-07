import { BigNumberish } from "@ethersproject/bignumber";

export type Range = {
  start: BigNumberish;
  length: BigNumberish;
  minted: BigNumberish;
  lastBurnedTokenId: BigNumberish;
};
