import { MetaTxConfig, Web3LibAdapter } from "@bosonprotocol/common";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { ContractTransaction } from "@ethersproject/contracts";

import { bosonExchangeHandlerIface } from "../exchanges/interface";
import { prepareDataSignatureParameters } from "../utils/signature";
import { Biconomy } from "./biconomy";

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

export async function relayMetaTransaction(args: {
  web3LibAdapter: Web3LibAdapter;
  chainId: number;
  contractAddress: string;
  metaTx: {
    config: MetaTxConfig;
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
}): Promise<ContractTransaction> {
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

      // TODO: add `getTransaction(hash)` to `Web3LibAdapter` and respective implementations
      // in ethers and eth-connect flavors. This way we can populate the correct transaction
      // data below.
      return {
        to: contractAddress,
        from: metaTx.params.userAddress,
        contractAddress: contractAddress,
        transactionIndex: 0,
        gasUsed: BigNumber.from(0),
        logsBloom: "",
        blockHash: "string",
        transactionHash: waitResponse.data.newHash,
        logs: [],
        blockNumber: 0,
        confirmations: 0,
        cumulativeGasUsed: BigNumber.from(0),
        effectiveGasPrice: BigNumber.from(waitResponse.data.newGasPrice),
        byzantium: true,
        type: 0,
        events: waitResponse.events?.map((event) => JSON.parse(event as string))
      };
    },
    hash: relayTxResponse.txHash,
    confirmations: 0,
    from: metaTx.params.userAddress,
    nonce: 0,
    gasLimit: BigNumber.from(0),
    data: "",
    value: BigNumber.from(0),
    chainId: chainId
  };
}
