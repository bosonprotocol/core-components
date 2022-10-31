import { abis } from "@bosonprotocol/common";
import { Interface } from "@ethersproject/abi";

export const nativeMetaTransactionsIface = new Interface(
  abis.NativeMetaTransactionABI
);

const noncesAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// Some tokens (USDC) does not implement getNonces(), but nonces() instead
export const alternativeNonceIface = new Interface(noncesAbi);
