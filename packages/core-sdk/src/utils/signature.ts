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
  Object.keys(domainData).forEach((key) => {
    if (domainData[key] === undefined) {
      delete domainData[key];
    }
  });

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

  const signerAddress = await args.web3Lib.getSignerAddress();
  const signature = await args.web3Lib.send("eth_signTypedData_v4", [
    signerAddress,
    dataToSign
  ]);

  return getSignatureParameters(signature);
}

export function getSignatureParameters(signature: string) {
  if (!isHexString(signature)) {
    throw new Error(`Value "${signature}" is not a valid hex string`);
  }

  const _signature = signature.substring(2);
  const r = "0x" + _signature.substring(0, 64);
  const s = "0x" + _signature.substring(64, 128);
  let v = parseInt(_signature.substring(128, 130), 16);

  if (!isNaN(v) && v < 2) {
    // support Ledger signature
    v = v + 27;
  }

  return {
    r,
    s,
    v,
    signature
  };
}
