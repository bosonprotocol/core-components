import { Web3LibAdapter } from "@bosonprotocol/common";
import { isHexString, hexZeroPad } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";

type SignatureArgs = {
  web3Lib: Web3LibAdapter;
  verifyingContractAddress: string;
  chainId: number;
  customSignatureType?: Record<string, unknown>;
  customDomainData?: Record<string, unknown>;
  primaryType: string;
  message: Record<string, unknown>;
};

export async function prepareDataSignatureParameters(args: SignatureArgs) {
  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "verifyingContract", type: "address" },
    { name: "salt", type: "bytes32" }
  ];

  const domainData = {
    name: "Boson Protocol",
    version: "V2",
    verifyingContract: args.verifyingContractAddress,
    salt: hexZeroPad(BigNumber.from(args.chainId).toHexString(), 32),
    ...args.customDomainData
  };

  const signatureTypes = {
    EIP712Domain: domainType,
    ...args.customSignatureType
  };

  const dataToSign = JSON.stringify({
    types: signatureTypes,
    domain: domainData,
    primaryType: args.primaryType,
    message: args.message
  });

  const signer = await args.web3Lib.getSignerAddress();
  const signature = await args.web3Lib.send("eth_signTypedData_v4", [
    signer,
    dataToSign
  ]);

  return getSignatureParameters(signature);
}

export function getSignatureParameters(signature: string) {
  if (!isHexString(signature)) {
    throw new Error(`Value "${signature}" is not a valid hex string`);
  }

  signature = signature.substring(2);
  const r = "0x" + signature.substring(0, 64);
  const s = "0x" + signature.substring(64, 128);
  let v = parseInt(signature.substring(128, 130), 16);

  if (!isNaN(v) && v < 2) {
    // support Ledger signature
    v = v + 27;
  }

  return {
    r,
    s,
    v
  };
}
