import { Web3LibAdapter } from "@bosonprotocol/common";
import { Signer } from "ethers";
import { createContext } from "react";

export const SignerContext = createContext<
  { externalWeb3LibAdapter: Web3LibAdapter; externalSigner: Signer } | undefined
>(undefined);
