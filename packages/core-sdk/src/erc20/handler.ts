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

export type UnsignedTransferAuthorization =
  | {
      strategy: "ERC3009";
      data: {
        validAfter: BigNumberish;
        validBefore: BigNumberish;
        nonce: string;
      };
    }
  | {
      strategy: "EIP2612";
      data: { deadline: BigNumberish };
    }
  | {
      strategy: "Permit2";
      data: { nonce: BigNumberish; deadline: BigNumberish };
    }
  | {
      strategy: "DAIPermit";
      data: { nonce: BigNumberish; expiry: BigNumberish };
    };

export type TransferAuthorization = UnsignedTransferAuthorization & {
  r: string;
  s: string;
  v: number;
  signature: string;
};

const TRANSFER_STRATEGY_ID = {
  ERC3009: 1,
  EIP2612: 2,
  Permit2: 3,
  DAIPermit: 4
} as const;

export function encodeTransferAuthorizationEntry(
  auth: TransferAuthorization
): string {
  let innerData: string;
  switch (auth.strategy) {
    case "ERC3009":
      innerData = defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes32", "uint8", "bytes32", "bytes32"],
        [
          auth.data.validAfter,
          auth.data.validBefore,
          auth.data.nonce,
          auth.v,
          auth.r,
          auth.s
        ]
      );
      break;
    case "EIP2612":
      innerData = defaultAbiCoder.encode(
        ["uint256", "uint8", "bytes32", "bytes32"],
        [auth.data.deadline, auth.v, auth.r, auth.s]
      );
      break;
    case "Permit2":
      innerData = defaultAbiCoder.encode(
        ["uint256", "uint256", "bytes"],
        [auth.data.nonce, auth.data.deadline, auth.signature]
      );
      break;
    case "DAIPermit":
      innerData = defaultAbiCoder.encode(
        ["uint256", "uint256", "uint8", "bytes32", "bytes32"],
        [auth.data.nonce, auth.data.expiry, auth.v, auth.r, auth.s]
      );
      break;
  }
  return defaultAbiCoder.encode(
    ["uint8", "bytes"],
    [TRANSFER_STRATEGY_ID[auth.strategy], innerData]
  );
}

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
  returnTxInfo?: boolean;
}) {
  if (args.returnTxInfo) {
    return;
  }
  const allowance = await getAllowance(args);
  if (BigNumber.from(allowance).lt(args.value)) {
    const approveTx = await approve({ ...args, returnTxInfo: false });
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
// Overload: returnTypedDataToSign is false or undefined → returns TransferAuthorization (ERC3009)
export async function signReceiveWithErc3009Authorization(
  args: SignReceiveWithErc3009AuthorizationArgs & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<TransferAuthorization & { strategy: "ERC3009" }>;
// Implementation
export async function signReceiveWithErc3009Authorization(
  args: SignReceiveWithErc3009AuthorizationArgs & {
    returnTypedDataToSign?: boolean;
  }
): Promise<(TransferAuthorization & { strategy: "ERC3009" }) | StructuredData> {
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

  return {
    ...sig,
    strategy: "ERC3009",
    data: {
      validAfter: args.validAfter,
      validBefore: args.validBefore,
      nonce
    }
  };
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
// Overload: returnTypedDataToSign is false or undefined → returns TransferAuthorization (EIP2612)
export async function signReceiveWithErc2612Permit(
  args: SignReceiveWithErc2612PermitArgs & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<TransferAuthorization & { strategy: "EIP2612" }>;
// Implementation
export async function signReceiveWithErc2612Permit(
  args: SignReceiveWithErc2612PermitArgs & {
    returnTypedDataToSign?: boolean;
  }
): Promise<(TransferAuthorization & { strategy: "EIP2612" }) | StructuredData> {
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

  return {
    ...sig,
    strategy: "EIP2612",
    data: { deadline: args.deadline }
  };
}

type SignReceiveWithPermit2Args = ApproveExchangeTokenBaseArgs & {
  permit2Address: string;
  deadline: BigNumberish;
  permit2Nonce?: BigNumberish;
};

// Overload: returnTypedDataToSign is true → returns StructuredData
export async function signReceiveWithPermit2(
  args: SignReceiveWithPermit2Args & { returnTypedDataToSign: true }
): Promise<StructuredData>;
// Overload: returnTypedDataToSign is false or undefined → returns TransferAuthorization (Permit2)
export async function signReceiveWithPermit2(
  args: SignReceiveWithPermit2Args & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<TransferAuthorization & { strategy: "Permit2" }>;
// Implementation
export async function signReceiveWithPermit2(
  args: SignReceiveWithPermit2Args & { returnTypedDataToSign?: boolean }
): Promise<(TransferAuthorization & { strategy: "Permit2" }) | StructuredData> {
  const permit2Nonce = args.permit2Nonce ?? BigNumber.from(randomBytes(32));

  const customSignatureType = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ],
    PermitTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ],
    TokenPermissions: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" }
    ]
  };

  const customDomainData = {
    name: "Permit2",
    chainId: args.chainId,
    version: undefined,
    salt: undefined
  };

  const message = {
    permitted: {
      token: args.exchangeToken,
      amount: args.value.toString()
    },
    spender: args.spender,
    nonce: permit2Nonce.toString(),
    deadline: args.deadline.toString()
  };

  const baseParams = {
    web3Lib: args.web3Lib,
    chainId: args.chainId,
    verifyingContractAddress: args.permit2Address,
    customSignatureType,
    customDomainData,
    primaryType: "PermitTransferFrom",
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

  return {
    ...sig,
    strategy: "Permit2",
    data: { nonce: permit2Nonce, deadline: args.deadline }
  };
}

type SignReceiveWithDaiPermitArgs = ApproveExchangeTokenBaseArgs & {
  tokenDomain: { name: string };
  expiry: BigNumberish;
};

// Overload: returnTypedDataToSign is true → returns StructuredData
export async function signReceiveWithDaiPermit(
  args: SignReceiveWithDaiPermitArgs & { returnTypedDataToSign: true }
): Promise<StructuredData>;
// Overload: returnTypedDataToSign is false or undefined → returns TransferAuthorization (DAIPermit)
export async function signReceiveWithDaiPermit(
  args: SignReceiveWithDaiPermitArgs & {
    returnTypedDataToSign?: false | undefined;
  }
): Promise<TransferAuthorization & { strategy: "DAIPermit" }>;
// Implementation
export async function signReceiveWithDaiPermit(
  args: SignReceiveWithDaiPermitArgs & { returnTypedDataToSign?: boolean }
): Promise<
  (TransferAuthorization & { strategy: "DAIPermit" }) | StructuredData
> {
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
      { name: "holder", type: "address" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "expiry", type: "uint256" },
      { name: "allowed", type: "bool" }
    ]
  };

  const customDomainData = {
    name: args.tokenDomain.name,
    version: "1",
    chainId: args.chainId,
    salt: undefined
  };

  const message = {
    holder: args.user,
    spender: args.spender,
    nonce: nonce.toString(),
    expiry: args.expiry.toString(),
    allowed: true
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

  return {
    ...sig,
    strategy: "DAIPermit",
    data: { nonce: nonce.toString(), expiry: args.expiry }
  };
}
