import { BigNumberish } from "@ethersproject/bignumber";

export type Range = {
  offerId: BigNumberish;
  start: BigNumberish;
  length: BigNumberish;
  minted: BigNumberish;
  lastBurnedTokenId: BigNumberish;
};
