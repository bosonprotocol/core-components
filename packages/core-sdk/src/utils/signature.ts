import { Web3LibAdapter } from "@bosonprotocol/common";
import { isHexString, hexZeroPad } from "@ethersproject/bytes";
import { BigNumber } from "@ethersproject/bignumber";

type SignatureArgs<T extends boolean> = {
  web3Lib: Web3LibAdapter;
  verifyingContractAddress: string;
  chainId: number;
  customSignatureType?: Record<string, unknown>;
  customDomainData?: Record<string, unknown>;
  primaryType: string;
  message: Record<string, unknown>;
  returnTypedDataToSign: T;
};

export type StructuredData = {
  types: {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
  };
  domain: {
    name: string;
    version: string;
    verifyingContract: string;
    salt: string;
  };
  primaryType: string;
  message: Record<string, unknown>;
};

export async function prepareDataSignatureParameters(
  args: SignatureArgs<true>
): Promise<StructuredData>;
export async function prepareDataSignatureParameters(
  args: SignatureArgs<false>
): Promise<ReturnType<typeof getSignatureParameters>>;
export async function prepareDataSignatureParameters(
  args: SignatureArgs<boolean>
): Promise<StructuredData | ReturnType<typeof getSignatureParameters>> {
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
  } satisfies {
    EIP712Domain: {
      name: string;
      type: string;
    }[];
  };

  const structuredDataToSign = {
    types: signatureTypes,
    domain: domainData,
    primaryType: args.primaryType,
    message: args.message
  } satisfies StructuredData;

  if (args.returnTypedDataToSign) {
    return structuredDataToSign; // Return the raw EIP-712 data
  }

  const dataToSign = JSON.stringify(structuredDataToSign);
  const signerAddress = await args.web3Lib.getSignerAddress();
  const signature = await args.web3Lib.send("eth_signTypedData_v4", [
    signerAddress,
    dataToSign
  ]);

  return getSignatureParameters(signature);
}

export function getSignatureParameters(signature: string): {
  r: string;
  s: string;
  v: number;
  signature: string;
} {
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
