import { Web3LibAdapter } from "@bosonprotocol/common";
import { isHexString, hexZeroPad } from "@ethersproject/bytes";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

type BaseMetaTxArgs = {
  web3Lib: Web3LibAdapter;
  nonce: BigNumberish;
  metaTxHandlerAddress: string;
  chainId: number;
};

export interface ECSignature {
  r: string;
  s: string;
  v: number;
}

export async function signExecuteMetaTx(
  args: BaseMetaTxArgs & {
    functionName: string;
    functionSignature: string;
  }
): Promise<ECSignature> {
  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "functionSignature", type: "bytes" }
  ];

  const customTransactionType = {
    MetaTransaction: metaTransactionType
  };

  const signerAddress = await args.web3Lib.getSignerAddress();

  const message = {
    nonce: args.nonce,
    from: signerAddress,
    contractAddress: args.metaTxHandlerAddress,
    functionName: args.functionName,
    functionSignature: args.functionSignature
  };

  return prepareDataSignatureParameters({
    ...args,
    customTransactionType,
    primaryType: "MetaTransaction",
    message
  });
}

export async function signExecuteMetaTxCommitToOffer(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
  }
): Promise<ECSignature> {
  const offerType = [
    { name: "buyer", type: "address" },
    { name: "offerId", type: "uint256" }
  ];

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "offerDetails", type: "MetaTxOfferDetails" }
  ];

  const customTransactionType = {
    MetaTxCommitToOffer: metaTransactionType,
    MetaTxOfferDetails: offerType
  };

  const buyerAddress = await args.web3Lib.getSignerAddress();

  const message = {
    nonce: args.nonce.toString(),
    from: buyerAddress,
    contractAddress: args.metaTxHandlerAddress,
    functionName: "commitToOffer(address,uint256)",
    offerDetails: {
      buyer: buyerAddress,
      offerId: args.offerId.toString()
    }
  };

  return prepareDataSignatureParameters({
    ...args,
    customTransactionType,
    primaryType: "MetaTxCommitToOffer",
    message
  });
}

export async function signExecuteMetaTxCancelVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
): Promise<ECSignature> {
  return makeExchangeMetaTxSigner("cancelVoucher(uint256)")(args);
}

export async function signExecuteMetaTxRedeemVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
): Promise<ECSignature> {
  return makeExchangeMetaTxSigner("redeemVoucher(uint256)")(args);
}

export async function signExecuteMetaTxCompleteExchange(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
): Promise<ECSignature> {
  return makeExchangeMetaTxSigner("completeExchange(uint256)")(args);
}

export async function signExecuteMetaTxRetractDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
): Promise<ECSignature> {
  return makeExchangeMetaTxSigner("retractDispute(uint256)")(args);
}

export async function signExecuteMetaTxEscalateDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
): Promise<ECSignature> {
  return makeExchangeMetaTxSigner("escalateDispute(uint256)")(args);
}

export async function signExecuteMetaTxRaiseDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
    complaint: string;
  }
): Promise<ECSignature> {
  const disputeType = [
    { name: "exchangeId", type: "uint256" },
    { name: "complaint", type: "string" }
  ];

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "disputeDetails", type: "MetaTxDisputeDetails" }
  ];

  const customTransactionType = {
    MetaTxDispute: metaTransactionType,
    MetaTxDisputeDetails: disputeType
  };

  const message = {
    nonce: args.nonce.toString(),
    from: await args.web3Lib.getSignerAddress(),
    contractAddress: args.metaTxHandlerAddress,
    functionName: "raiseDispute(uint256,string)",
    disputeDetails: {
      exchangeId: args.exchangeId.toString(),
      complaint: args.complaint
    }
  };

  return prepareDataSignatureParameters({
    ...args,
    customTransactionType,
    primaryType: "MetaTxDispute",
    message
  });
}

export async function signExecuteMetaTxResolveDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
    buyerPercent: string;
    counterpartySig: {
      r: string;
      s: string;
      v: string;
    };
  }
): Promise<ECSignature> {
  const disputeResolutionType = [
    { name: "exchangeId", type: "uint256" },
    { name: "buyerPercent", type: "uint256" },
    { name: "sigR", type: "bytes32" },
    { name: "sigS", type: "bytes32" },
    { name: "sigV", type: "uint8" }
  ];

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "disputeResolutionDetails", type: "MetaTxDisputeResolutionDetails" }
  ];

  const customTransactionType = {
    MetaTxDisputeResolution: metaTransactionType,
    MetaTxDisputeResolutionDetails: disputeResolutionType
  };

  const message = {
    nonce: args.nonce.toString(),
    from: await args.web3Lib.getSignerAddress(),
    contractAddress: args.metaTxHandlerAddress,
    functionName: "resolveDispute(uint256,uint256,bytes32,bytes32,uint8)",
    disputeResolutionDetails: {
      exchangeId: args.exchangeId.toString(),
      buyerPercent: args.buyerPercent.toString(),
      sigR: args.counterpartySig.r,
      sigS: args.counterpartySig.s,
      sigV: args.counterpartySig.v
    }
  };

  return prepareDataSignatureParameters({
    ...args,
    customTransactionType,
    primaryType: "MetaTxDisputeResolution",
    message
  });
}

export async function signExecuteMetaTxWithdrawFunds(
  args: BaseMetaTxArgs & {
    entityId: BigNumberish;
    tokenList: string[];
    tokenAmounts: BigNumberish[];
  }
): Promise<ECSignature> {
  const fundType = [
    { name: "entityId", type: "uint256" },
    { name: "tokenList", type: "address[]" },
    { name: "tokenAmounts", type: "uint256[]" }
  ];

  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "fundDetails", type: "MetaTxFundDetails" }
  ];

  const customTransactionType = {
    MetaTxFund: metaTransactionType,
    MetaTxFundDetails: fundType
  };

  const message = {
    nonce: args.nonce.toString(),
    from: await args.web3Lib.getSignerAddress(),
    contractAddress: args.metaTxHandlerAddress,
    functionName: "withdrawFunds(uint256,bytes32,bytes32,uint8)",
    fundDetails: {
      entityId: args.entityId,
      tokenList: args.tokenList,
      tokenAmounts: args.tokenAmounts
    }
  };

  return prepareDataSignatureParameters({
    ...args,
    customTransactionType,
    primaryType: "MetaTxFund",
    message
  });
}

function makeExchangeMetaTxSigner(
  functionName:
    | "cancelVoucher(uint256)"
    | "redeemVoucher(uint256)"
    | "completeExchange(uint256)"
    | "retractDispute(uint256)"
    | "escalateDispute(uint256)"
) {
  return async function signExchangeMetaTx(
    args: BaseMetaTxArgs & {
      exchangeId: BigNumberish;
    }
  ): Promise<ECSignature> {
    const exchangeType = [{ name: "exchangeId", type: "uint256" }];

    const metaTransactionType = [
      { name: "nonce", type: "uint256" },
      { name: "from", type: "address" },
      { name: "contractAddress", type: "address" },
      { name: "functionName", type: "string" },
      { name: "exchangeDetails", type: "MetaTxExchangeDetails" }
    ];

    const customTransactionType = {
      MetaTxExchange: metaTransactionType,
      MetaTxExchangeDetails: exchangeType
    };

    const buyerAddress = await args.web3Lib.getSignerAddress();

    const message = {
      nonce: args.nonce.toString(),
      from: buyerAddress,
      contractAddress: args.metaTxHandlerAddress,
      functionName,
      exchangeDetails: {
        exchangeId: args.exchangeId.toString()
      }
    };

    return prepareDataSignatureParameters({
      ...args,
      customTransactionType,
      primaryType: "MetaTxExchange",
      message
    });
  };
}

export async function prepareDataSignatureParameters(
  args: BaseMetaTxArgs & {
    customTransactionType?: Record<string, unknown>;
    primaryType: string;
    message: Record<string, unknown>;
  }
): Promise<ECSignature> {
  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "verifyingContract", type: "address" },
    { name: "salt", type: "bytes32" }
  ];

  const domainData = {
    name: "BosonProtocolDiamond",
    version: "V1",
    verifyingContract: args.metaTxHandlerAddress,
    salt: hexZeroPad(BigNumber.from(args.chainId).toHexString(), 32)
  };

  const metaTxTypes = {
    EIP712Domain: domainType,
    ...args.customTransactionType
  };

  const dataToSign = JSON.stringify({
    types: metaTxTypes,
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

export function getSignatureParameters(signature: string): ECSignature {
  if (!isHexString(signature)) {
    throw new Error(`Value "${signature}" is not a valid hex string`);
  }

  signature = signature.substring(2);
  const r = "0x" + signature.substring(0, 64);
  const s = "0x" + signature.substring(64, 128);
  const v = parseInt(signature.substring(128, 130), 16);

  return {
    r,
    s,
    v
  };
}
