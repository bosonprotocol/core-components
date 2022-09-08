import { Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { ContractTransaction } from "ethers";
import fetch from "cross-fetch";

import { bosonExchangeHandlerIface } from "../exchanges/interface";
import { prepareDataSignatureParameters } from "../utils/signature";

type BaseMetaTxArgs = {
  web3Lib: Web3LibAdapter;
  nonce: BigNumberish;
  metaTxHandlerAddress: string;
  chainId: number;
};

export async function signExecuteMetaTx(
  args: BaseMetaTxArgs & {
    functionName: string;
    functionSignature: string;
  }
) {
  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "contractAddress", type: "address" },
    { name: "functionName", type: "string" },
    { name: "functionSignature", type: "bytes" }
  ];

  const customSignatureType = {
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
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    primaryType: "MetaTransaction",
    message
  });
}

export async function signExecuteMetaTxCommitToOffer(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
  }
) {
  const functionName = "commitToOffer(address,uint256)";

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

  const customSignatureType = {
    MetaTxCommitToOffer: metaTransactionType,
    MetaTxOfferDetails: offerType
  };

  const buyerAddress = await args.web3Lib.getSignerAddress();

  const message = {
    nonce: args.nonce.toString(),
    from: buyerAddress,
    contractAddress: args.metaTxHandlerAddress,
    functionName,
    offerDetails: {
      buyer: buyerAddress,
      offerId: args.offerId.toString()
    }
  };

  const signatureParams = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    primaryType: "MetaTxCommitToOffer",
    message
  });

  return {
    ...signatureParams,
    functionName,
    functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
      "commitToOffer",
      [buyerAddress, args.offerId]
    )
  };
}

export async function signExecuteMetaTxCancelVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("cancelVoucher(uint256)")(args);
}

export async function signExecuteMetaTxRedeemVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("redeemVoucher(uint256)")(args);
}

export async function signExecuteMetaTxCompleteExchange(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("completeExchange(uint256)")(args);
}

export async function signExecuteMetaTxRetractDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("retractDispute(uint256)")(args);
}

export async function signExecuteMetaTxEscalateDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("escalateDispute(uint256)")(args);
}

export async function signExecuteMetaTxRaiseDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
    complaint: string;
  }
) {
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

  const customSignatureType = {
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

  // TODO: encode function data when adding dispute resolver module
  return prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
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
) {
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

  const customSignatureType = {
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

  // TODO: encode function data when adding dispute resolver module
  return prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
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
) {
  const functionName = "withdrawFunds(uint256,bytes32,bytes32,uint8)";

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

  const customSignatureType = {
    MetaTxFund: metaTransactionType,
    MetaTxFundDetails: fundType
  };

  const message = {
    nonce: args.nonce.toString(),
    from: await args.web3Lib.getSignerAddress(),
    contractAddress: args.metaTxHandlerAddress,
    functionName,
    fundDetails: {
      entityId: args.entityId,
      tokenList: args.tokenList,
      tokenAmounts: args.tokenAmounts
    }
  };

  const signatureParams = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    primaryType: "MetaTxFund",
    message
  });

  return {
    ...signatureParams,
    functionName,
    functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
      "withdrawFunds",
      [args.entityId, args.tokenList, args.tokenAmounts]
    )
  };
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
  ) {
    const exchangeType = [{ name: "exchangeId", type: "uint256" }];

    const metaTransactionType = [
      { name: "nonce", type: "uint256" },
      { name: "from", type: "address" },
      { name: "contractAddress", type: "address" },
      { name: "functionName", type: "string" },
      { name: "exchangeDetails", type: "MetaTxExchangeDetails" }
    ];

    const customSignatureType = {
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

    const signatureParams = await prepareDataSignatureParameters({
      ...args,
      verifyingContractAddress: args.metaTxHandlerAddress,
      customSignatureType,
      primaryType: "MetaTxExchange",
      message
    });

    return {
      ...signatureParams,
      functionName,
      functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
        // remove params in brackets from string
        functionName.replace(/\(([^)]*)\)[^(]*$/, ""),
        [args.exchangeId]
      )
    };
  };
}

export async function relayMetaTransaction(
  config: {
    chainId: number;
    contractAddress: string;
    metaTransactionsRelayerUrl: string;
    metaTransactionsApiKey: string;
    metaTransactionsApiId: string;
  },
  params: {
    userAddress: string;
    functionName: string;
    functionSignature: BytesLike;
    nonce: BigNumberish;
    sigR: BytesLike;
    sigS: BytesLike;
    sigV: BigNumberish;
  }
): Promise<ContractTransaction> {
  const body = {
    to: config.contractAddress,
    apiId: config.metaTransactionsApiId,
    params: [
      params.userAddress,
      params.functionName,
      params.functionSignature,
      params.nonce,
      params.sigR,
      params.sigS,
      params.sigV
    ],
    from: params.userAddress
  };
  const responsePromise = fetch(config.metaTransactionsRelayerUrl, {
    method: "POST",
    headers: {
      "x-api-key": config.metaTransactionsApiKey,
      "content-type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(body)
  });
  return {
    wait: async () => {
      const response = await responsePromise;
      const responseJSON = await response.json();
      console.log("meta tx relay response", response, responseJSON);
      if (!response.ok) {
        throw new Error(
          `Failure to relay the metaTransaction: ${JSON.stringify(
            responseJSON || response
          )}`
        );
      }
      return {
        to: config.contractAddress,
        from: params.userAddress,
        contractAddress: config.contractAddress,
        transactionIndex: 0,
        gasUsed: BigNumber.from(0),
        logsBloom: "",
        blockHash: "string",
        transactionHash: responseJSON.txHash,
        logs: [],
        blockNumber: 0,
        confirmations: 0,
        cumulativeGasUsed: BigNumber.from(0),
        effectiveGasPrice: BigNumber.from(0),
        byzantium: true,
        type: 0,
        events: []
      };
    },
    hash: "",
    confirmations: 1,
    from: params.userAddress,
    nonce: 0,
    gasLimit: BigNumber.from(0),
    data: "",
    value: BigNumber.from(0),
    chainId: config.chainId
  };
}
