import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse
} from "@bosonprotocol/common";
import { defaultAbiCoder } from "@ethersproject/abi";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { hexlify } from "@ethersproject/bytes";
import { randomBytes } from "@ethersproject/random";
import { erc20Iface } from "./interface";
import type { ApproveExchangeTokenBaseArgs } from "../native-meta-tx/handler";
import { alternativeNonceIface } from "../native-meta-tx/interface";
import {
  prepareDataSignatureParameters,
  StructuredData
} from "../utils/signature";

export type SignedReceiveWithAuthorization = {
  r: string;
  s: string;
  v: number;
  signature: string;
  // defaultAbiCoder.encode(
  //   ["uint256","uint256","bytes32","uint8","bytes32","bytes32"],
  //   [validAfter, validBefore, nonce, v, r, s]
  // ) — drop-in payload for the protocol's TokenTransferAuthorization auth entry.
  abiData: string;
};

export type SignedReceivePermit = {
  r: string;
  s: string;
  v: number;
  signature: string;
  // defaultAbiCoder.encode(
  //   ["uint256","uint8","bytes32","bytes32"],
  //   [deadline, v, r, s]
  // ) — drop-in payload for the protocol's TokenTransferAuthorization
  //  EIP-2612 auth entry.
  abiData: string;
};

// Overload: returnTxInfo is true -> returns TransactionRequest
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo: true;
}): Promise<TransactionRequest>;

// Overload: returnTxInfo is false or undefined -> returns TransactionResponse
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo?: false | undefined;
}): Promise<TransactionResponse>;

// Implementation
export async function approve(args: {
  contractAddress: string;
  spender: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
  returnTxInfo?: boolean;
}): Promise<TransactionRequest | TransactionResponse> {
  const transactionRequest: TransactionRequest = {
    ...args.txRequest,
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("approve", [args.spender, args.value])
  };

  if (args.returnTxInfo) {
    return transactionRequest;
  } else {
    return args.web3Lib.sendTransaction(transactionRequest);
  }
}

export async function getAllowance(args: {
  contractAddress: string;
  owner: string;
  spender: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("allowance", [args.owner, args.spender])
  });

  const [allowance] = erc20Iface.decodeFunctionResult("allowance", result);
  return String(allowance);
}

export async function getDecimals(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("decimals", [])
  });

  const [decimals] = erc20Iface.decodeFunctionResult("decimals", result);
  return Number(decimals);
}

export async function getSymbol(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("symbol", [])
  });

  const [symbols] = erc20Iface.decodeFunctionResult("symbol", result);
  return String(symbols);
}

export async function getName(args: {
  contractAddress: string;
  web3Lib: Web3LibAdapter;
}) {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("name", [])
  });

  const [name] = erc20Iface.decodeFunctionResult("name", result);
  return String(name);
}

export async function ensureAllowance(args: {
  owner: string;
  spender: string;
  contractAddress: string;
  value: BigNumberish;
  web3Lib: Web3LibAdapter;
  txRequest?: TransactionRequest;
}) {
  const allowance = await getAllowance(args);
  if (BigNumber.from(allowance).lt(args.value)) {
    const approveTx = await approve(args);
    await approveTx.wait();
  }
}

export async function balanceOf(args: {
  contractAddress: string;
  owner: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: erc20Iface.encodeFunctionData("balanceOf", [args.owner])
  });

  const [balance] = erc20Iface.decodeFunctionResult("balanceOf", result);
  return String(balance);
}

type SignReceiveWithErc3009AuthorizationArgs = ApproveExchangeTokenBaseArgs & {
  tokenDomain: { name: string; version: string };
  validAfter: BigNumberish;
  validBefore: BigNumberish;
};

// Overload: returnTypedDataToSign is true → returns StructuredData
export async function signReceiveWithErc3009Authorization(
  args: SignReceiveWithErc3009AuthorizationArgs & {
    returnTypedDataToSign: true;
  }
): Promise<StructuredData>;
// Overload: returnTypedDataToSign is false or undefined → returns SignedReceiveWithAuthorization
export async function signReceiveWithErc3009Authorization(
  args: SignReceiveWithErc3009AuthorizationArgs & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<SignedReceiveWithAuthorization>;
// Implementation
export async function signReceiveWithErc3009Authorization(
  args: SignReceiveWithErc3009AuthorizationArgs & {
    returnTypedDataToSign?: boolean;
  }
): Promise<SignedReceiveWithAuthorization | StructuredData> {
  const nonce = hexlify(randomBytes(32));

  const customSignatureType = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ],
    ReceiveWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" }
    ]
  };

  const customDomainData = {
    name: args.tokenDomain.name,
    version: args.tokenDomain.version,
    chainId: args.chainId,
    salt: undefined
  };

  const message = {
    from: args.user,
    to: args.spender,
    value: args.value.toString(),
    validAfter: args.validAfter.toString(),
    validBefore: args.validBefore.toString(),
    nonce
  };

  const baseParams = {
    web3Lib: args.web3Lib,
    chainId: args.chainId,
    verifyingContractAddress: args.exchangeToken,
    customSignatureType,
    customDomainData,
    primaryType: "ReceiveWithAuthorization",
    message
  };

  if (args.returnTypedDataToSign) {
    return prepareDataSignatureParameters({
      ...baseParams,
      returnTypedDataToSign: true
    });
  }

  const sig = await prepareDataSignatureParameters({
    ...baseParams,
    returnTypedDataToSign: false
  });

  const abiData = defaultAbiCoder.encode(
    ["uint256", "uint256", "bytes32", "uint8", "bytes32", "bytes32"],
    [args.validAfter, args.validBefore, nonce, sig.v, sig.r, sig.s]
  );

  return { ...sig, abiData };
}

type SignReceiveWithErc2612PermitArgs = ApproveExchangeTokenBaseArgs & {
  tokenDomain: { name: string; version: string };
  deadline: BigNumberish;
};

// Overload: returnTypedDataToSign is true → returns StructuredData
export async function signReceiveWithErc2612Permit(
  args: SignReceiveWithErc2612PermitArgs & {
    returnTypedDataToSign: true;
  }
): Promise<StructuredData>;
// Overload: returnTypedDataToSign is false or undefined → returns SignedReceivePermit
export async function signReceiveWithErc2612Permit(
  args: SignReceiveWithErc2612PermitArgs & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<SignedReceivePermit>;
// Implementation
export async function signReceiveWithErc2612Permit(
  args: SignReceiveWithErc2612PermitArgs & {
    returnTypedDataToSign?: boolean;
  }
): Promise<SignedReceivePermit | StructuredData> {
  const nonceResult = await args.web3Lib.call({
    to: args.exchangeToken,
    data: alternativeNonceIface.encodeFunctionData("nonces", [args.user])
  });
  const [nonce] = alternativeNonceIface.decodeFunctionResult(
    "nonces",
    nonceResult
  );

  const customSignatureType = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ],
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ]
  };

  const customDomainData = {
    name: args.tokenDomain.name,
    version: args.tokenDomain.version,
    chainId: args.chainId,
    salt: undefined
  };

  const message = {
    owner: args.user,
    spender: args.spender,
    value: args.value.toString(),
    nonce: nonce.toString(),
    deadline: args.deadline.toString()
  };

  const baseParams = {
    web3Lib: args.web3Lib,
    chainId: args.chainId,
    verifyingContractAddress: args.exchangeToken,
    customSignatureType,
    customDomainData,
    primaryType: "Permit",
    message
  };

  if (args.returnTypedDataToSign) {
    return prepareDataSignatureParameters({
      ...baseParams,
      returnTypedDataToSign: true
    });
  }

  const sig = await prepareDataSignatureParameters({
    ...baseParams,
    returnTypedDataToSign: false
  });

  const abiData = defaultAbiCoder.encode(
    ["uint256", "uint8", "bytes32", "bytes32"],
    [args.deadline, sig.v, sig.r, sig.s]
  );

  return { ...sig, abiData };
}
