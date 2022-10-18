import {
  CreateOfferArgs,
  CreateSellerArgs,
  MetaTxConfig,
  Web3LibAdapter,
  TransactionResponse
} from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";

import { encodeCreateSeller } from "../accounts/interface";
import { bosonExchangeHandlerIface } from "../exchanges/interface";
import {
  bosonOfferHandlerIface,
  encodeCreateOffer,
  encodeCreateOfferBatch
} from "../offers/interface";
import { prepareDataSignatureParameters } from "../utils/signature";
import { Biconomy, GetRetriedHashesData } from "./biconomy";

export type BaseMetaTxArgs = {
  web3Lib: Web3LibAdapter;
  nonce: BigNumberish;
  metaTxHandlerAddress: string;
  chainId: number;
};

export type SignedMetaTx = {
  functionName: string;
  functionSignature: string;
  r: string;
  s: string;
  v: number;
};

export async function signMetaTx(
  args: BaseMetaTxArgs & {
    functionName: string;
    functionSignature: string;
  }
): Promise<SignedMetaTx> {
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

  const signature = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    primaryType: "MetaTransaction",
    message
  });

  return {
    functionName: args.functionName,
    functionSignature: args.functionSignature,
    ...signature
  };
}

export async function signMetaTxCreateSeller(
  args: BaseMetaTxArgs & {
    createSellerArgs: CreateSellerArgs;
  }
) {
  return signMetaTx({
    ...args,
    functionName:
      "createSeller((uint256,address,address,address,address,bool),(uint256,uint8),(string,uint256))",
    functionSignature: encodeCreateSeller(args.createSellerArgs)
  });
}

export async function signMetaTxCreateOffer(
  args: BaseMetaTxArgs & {
    createOfferArgs: CreateOfferArgs;
  }
) {
  return signMetaTx({
    ...args,
    functionName:
      "createOffer((uint256,uint256,uint256,uint256,uint256,uint256,address,string,string,bool),(uint256,uint256,uint256,uint256),(uint256,uint256,uint256),uint256,uint256)",
    functionSignature: encodeCreateOffer(args.createOfferArgs)
  });
}

export async function signMetaTxCreateOfferBatch(
  args: BaseMetaTxArgs & {
    createOffersArgs: CreateOfferArgs[];
  }
) {
  return signMetaTx({
    ...args,
    functionName:
      "createOfferBatch((uint256,uint256,uint256,uint256,uint256,uint256,address,string,string,bool)[],(uint256,uint256,uint256,uint256)[],(uint256,uint256,uint256)[],uint256[],uint256[])",
    functionSignature: encodeCreateOfferBatch(args.createOffersArgs)
  });
}

export async function signMetaTxVoidOffer(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "voidOffer(uint256)",
    functionSignature: bosonOfferHandlerIface.encodeFunctionData("voidOffer", [
      args.offerId
    ])
  });
}

export async function signMetaTxVoidOfferBatch(
  args: BaseMetaTxArgs & {
    offerIds: BigNumberish[];
  }
) {
  return signMetaTx({
    ...args,
    functionName: "voidOfferBatch(uint256[])",
    functionSignature: bosonOfferHandlerIface.encodeFunctionData(
      "voidOfferBatch",
      [args.offerIds]
    )
  });
}

export async function signMetaTxCompleteExchangeBatch(
  args: BaseMetaTxArgs & {
    exchangeIds: BigNumberish[];
  }
) {
  return signMetaTx({
    ...args,
    functionName: "completeExchangeBatch(uint256[])",
    functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
      "completeExchangeBatch",
      [args.exchangeIds]
    )
  });
}

export async function signMetaTxExpireVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "expireVoucher(uint256)",
    functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
      "expireVoucher",
      [args.exchangeId]
    )
  });
}

export async function signMetaTxCommitToOffer(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
  }
): Promise<SignedMetaTx> {
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

export async function signMetaTxCancelVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("cancelVoucher(uint256)")(args);
}

export async function signMetaTxRedeemVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("redeemVoucher(uint256)")(args);
}

export async function signMetaTxCompleteExchange(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("completeExchange(uint256)")(args);
}

export async function signMetaTxRetractDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("retractDispute(uint256)")(args);
}

export async function signMetaTxEscalateDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner("escalateDispute(uint256)")(args);
}

export async function signMetaTxRaiseDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  const disputeType = [{ name: "exchangeId", type: "uint256" }];

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
    functionName: "raiseDispute(uint256)",
    disputeDetails: {
      exchangeId: args.exchangeId.toString()
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

export async function signMetaTxResolveDispute(
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

export async function signMetaTxWithdrawFunds(
  args: BaseMetaTxArgs & {
    entityId: BigNumberish;
    tokenList: string[];
    tokenAmounts: BigNumberish[];
  }
): Promise<SignedMetaTx> {
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
  ): Promise<SignedMetaTx> {
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

export async function relayMetaTransaction(args: {
  web3LibAdapter: Web3LibAdapter;
  chainId: number;
  contractAddress: string;
  metaTx: {
    config: Omit<MetaTxConfig, "apiIds"> & { apiId: string };
    params: {
      userAddress: string;
      functionName: string;
      functionSignature: BytesLike;
      nonce: BigNumberish;
      sigR: BytesLike;
      sigS: BytesLike;
      sigV: BigNumberish;
    };
  };
}): Promise<TransactionResponse> {
  const { chainId, contractAddress, metaTx } = args;

  const biconomy = new Biconomy(
    metaTx.config.relayerUrl,
    metaTx.config.apiKey,
    metaTx.config.apiId
  );

  const relayTxResponse = await biconomy.relayTransaction({
    to: contractAddress,
    params: [
      metaTx.params.userAddress,
      metaTx.params.functionName,
      metaTx.params.functionSignature,
      metaTx.params.nonce,
      metaTx.params.sigR,
      metaTx.params.sigS,
      metaTx.params.sigV
    ],
    from: metaTx.params.userAddress
  });

  return {
    wait: async () => {
      const waitResponse = await biconomy.wait({
        networkId: chainId,
        transactionHash: relayTxResponse.txHash
      });

      const txHash = waitResponse.data.newHash;
      const txReceipt = await args.web3LibAdapter.getTransactionReceipt(txHash);
      return {
        to: txReceipt?.to || contractAddress,
        from: txReceipt?.from || metaTx.params.userAddress,
        transactionHash: txHash,
        logs: txReceipt?.logs || [],
        effectiveGasPrice: BigNumber.from(waitResponse.data.newGasPrice)
      };
    },
    hash: relayTxResponse.txHash
  };
}

export async function getResubmitted(args: {
  chainId: number;
  metaTx: {
    config: Partial<Omit<MetaTxConfig, "apiIds"> & { apiId: string }>;
    originalHash: string;
  };
}): Promise<GetRetriedHashesData> {
  const { chainId, metaTx } = args;

  const biconomy = new Biconomy(
    metaTx.config.relayerUrl,
    metaTx.config.apiKey,
    metaTx.config.apiId
  );

  const retriedHashesResponse = await biconomy.getResubmitted({
    networkId: chainId,
    transactionHash: metaTx.originalHash
  });

  return retriedHashesResponse.data;
}
