import {
  MetaTxConfig,
  Web3LibAdapter,
  TransactionResponse
} from "@bosonprotocol/common";
import { BigNumberish, BigNumber } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";
import { Biconomy } from "../meta-tx/biconomy";
import { BaseMetaTxArgs, SignedMetaTx } from "../meta-tx/handler";
import { prepareDataSignatureParameters } from "../utils/signature";
import { nativeMetaTransactionsIface } from "./interface";

export async function getNonce(args: {
  contractAddress: string;
  user: string;
  web3Lib: Web3LibAdapter;
}): Promise<string> {
  const result = await args.web3Lib.call({
    to: args.contractAddress,
    data: nativeMetaTransactionsIface.encodeFunctionData("getNonce", [
      args.user
    ])
  });

  const [nonce] = nativeMetaTransactionsIface.decodeFunctionResult(
    "getNonce",
    result
  );
  return String(nonce);
}

export async function signNativeMetaTx(
  args: BaseMetaTxArgs & {
    functionName: string;
    functionSignature: string;
    domain: {
      name: string;
      version: string;
    };
  }
): Promise<SignedMetaTx> {
  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
  ];

  const customSignatureType = {
    MetaTransaction: metaTransactionType
  };

  const signerAddress = await args.web3Lib.getSignerAddress();

  const message = {
    nonce: args.nonce,
    from: signerAddress,
    functionSignature: args.functionSignature
  };

  const signature = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    customDomainData: args.domain,
    primaryType: "MetaTransaction",
    message
  });

  return {
    functionName: args.functionName,
    functionSignature: args.functionSignature,
    ...signature
  };
}

export async function relayNativeMetaTransaction(args: {
  web3LibAdapter: Web3LibAdapter;
  chainId: number;
  contractAddress: string;
  metaTx: {
    config: Omit<MetaTxConfig, "apiIds"> & { apiId: string };
    params: {
      userAddress: string;
      functionSignature: BytesLike;
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
      metaTx.params.functionSignature,
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
