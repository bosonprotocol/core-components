import { Web3LibAdapter } from "@bosonprotocol/common";
import { decodeGetNonce, encodeGetNonce } from "./interface";

export async function getNonce(args: {
  contractAddress: string;
  user: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: encodeGetNonce(args.user)
  });
  const [nonce] = decodeGetNonce(result);
  return String(nonce);
}
