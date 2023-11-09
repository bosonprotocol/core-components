import { Web3LibAdapter } from "@bosonprotocol/common";
import { erc165Iface } from "./interface";

export async function supportsInterface(args: {
  contractAddress: string;
  interfaceId: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc165Iface.encodeFunctionData("supportsInterface", [
      args.interfaceId
    ])
  });

  const [supportsInterface] = erc165Iface.decodeFunctionResult(
    "supportsInterface",
    result
  );
  return Boolean(supportsInterface);
}
