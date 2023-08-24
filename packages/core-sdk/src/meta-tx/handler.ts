import {
  CreateOfferArgs,
  CreateSellerArgs,
  MetaTxConfig,
  Web3LibAdapter,
  TransactionResponse,
  utils,
  MetadataStorage,
  CreateGroupArgs,
  ConditionStruct,
  UpdateSellerArgs,
  OptInToSellerUpdateArgs,
  envConfigs,
  abis
} from "@bosonprotocol/common";
import { storeMetadataOnTheGraph } from "../offers/storage";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bytes";

import {
  encodeCreateSeller,
  encodeOptInToSellerUpdate,
  encodeUpdateSeller
} from "../accounts/interface";
import { bosonExchangeHandlerIface } from "../exchanges/interface";
import {
  bosonOfferHandlerIface,
  encodeCreateOffer,
  encodeCreateOfferBatch,
  encodeReserveRange
} from "../offers/interface";
import { prepareDataSignatureParameters } from "../utils/signature";
import {
  Biconomy,
  ForwarderDomainData,
  GetRetriedHashesData
} from "./biconomy";
import { isAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { encodeDepositFunds, encodeWithdrawFunds } from "../funds/interface";
import { bosonDisputeHandlerIface } from "../disputes/interface";
import { encodeCreateGroup } from "../groups/interface";
import { encodeCreateOfferWithCondition } from "../orchestration/interface";
import {
  encodeCallExternalContract,
  encodePreMint,
  encodeSetApprovalForAll,
  encodeSetApprovalForAllToContract
} from "../voucher/interface";
import { keccak256 } from "@ethersproject/keccak256";
import { id } from "@ethersproject/hash";
import { defaultAbiCoder } from "@ethersproject/abi";
import { ERC20ForwardRequest } from "../forwarder/biconomy-interface";
import { getNonce, verifyEIP712 } from "../forwarder/handler";
import { MockForwardRequest } from "../forwarder/mock-interface";
import { isTrustedForwarder } from "../voucher/handler";

export type BaseMetaTxArgs = {
  web3Lib: Web3LibAdapter;
  nonce: BigNumberish;
  metaTxHandlerAddress: string;
  chainId: number;
};

export type BaseVoucherMetaTxArgs = {
  web3Lib: Web3LibAdapter;
  bosonVoucherAddress: string;
  chainId: number;
};

export type SignedMetaTx = {
  functionName: string;
  functionSignature: string;
  r: string;
  s: string;
  v: number;
};

export type SignedVoucherMetaTx = Omit<SignedMetaTx, "functionName"> & {
  to: string;
  signature: string;
  request: ERC20ForwardRequest | MockForwardRequest;
  domainSeparator?: string;
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

export async function signVoucherMetaTx(
  args: BaseVoucherMetaTxArgs & {
    forwarderAbi: typeof abis.MockForwarderABI;
    functionSignature: string;
    forwarderAddress: string;
  }
): Promise<SignedVoucherMetaTx> {
  const forwardType = [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" }
  ];

  const customSignatureType = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ],
    ForwardRequest: forwardType
  };

  const signerAddress = await args.web3Lib.getSignerAddress();
  const chainId = await args.web3Lib.getChainId();
  const nonce = await getNonce({
    contractAddress: args.forwarderAddress,
    user: signerAddress,
    web3Lib: args.web3Lib,
    forwarderAbi: args.forwarderAbi
  });

  const message = {
    from: signerAddress,
    to: args.bosonVoucherAddress,
    nonce,
    data: args.functionSignature
  };

  const signature = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.forwarderAddress,
    customSignatureType,
    primaryType: "ForwardRequest",
    message,
    customDomainData: {
      name: "MockForwarder",
      version: "0.0.1",
      chainId,
      salt: undefined
    }
  });

  return {
    to: message.to,
    functionSignature: args.functionSignature,
    request: message,
    ...signature
  };
}

export async function signBiconomyVoucherMetaTx(
  args: BaseVoucherMetaTxArgs & {
    functionSignature: string;
    batchId: BigNumberish;
    forwarderAbi:
      | typeof abis.MockForwarderABI
      | typeof abis.BiconomyForwarderABI;
    txGas: BigNumberish;
    relayerUrl: string;
  }
): Promise<SignedVoucherMetaTx> {
  const customSignatureType = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      // { name: "chainId", type: "uint256" },
      // { name: "verifyingContract", type: "address" }
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" }
    ],
    ERC20ForwardRequest: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "token", type: "address" },
      { name: "txGas", type: "uint256" },
      { name: "tokenGasPrice", type: "uint256" },
      { name: "batchId", type: "uint256" },
      { name: "batchNonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "data", type: "bytes" }
    ]
  };

  const signerAddress = await args.web3Lib.getSignerAddress();
  const chainId = await args.web3Lib.getChainId();

  // Check which forwarder needs to be used for the contract
  const biconomyForwarderDomainDetails = await new Biconomy(
    args.relayerUrl
  ).getForwarderDomainDetails({ chainId });

  const biconomyForwarderDomainData = await new Promise<
    ForwarderDomainData | undefined
    // eslint-disable-next-line no-async-promise-executor
  >(async (resolve, reject) => {
    try {
      for (const bFDD of Object.values(biconomyForwarderDomainDetails)) {
        const ret = await isTrustedForwarder({
          forwarder: bFDD.verifyingContract,
          contractAddress: args.bosonVoucherAddress,
          web3Lib: args.web3Lib
        });
        if (ret) {
          resolve(bFDD);
        }
      }
      resolve(undefined);
    } catch (e) {
      reject(e);
    }
  });
  if (!biconomyForwarderDomainData) {
    throw `Unable to find the trusted forwarder for BosonVoucher contract ${args.bosonVoucherAddress}`;
  }

  const nonce = await getNonce({
    contractAddress: biconomyForwarderDomainData.verifyingContract,
    user: signerAddress,
    web3Lib: args.web3Lib,
    batchId: args.batchId,
    forwarderAbi: args.forwarderAbi
  });

  const message = {
    from: signerAddress,
    to: args.bosonVoucherAddress,
    token: "0x0000000000000000000000000000000000000000",
    txGas: args.txGas,
    tokenGasPrice: "0",
    batchId: args.batchId,
    batchNonce: nonce,
    deadline: Math.floor(Date.now() / 1000 + 3600),
    data: args.functionSignature
  };

  const signatureParams = await prepareDataSignatureParameters({
    ...args,
    chainId,
    verifyingContractAddress: biconomyForwarderDomainData.verifyingContract,
    customSignatureType,
    primaryType: "ERC20ForwardRequest",
    message,
    customDomainData: {
      ...biconomyForwarderDomainData
      // chainId
      // salt: undefined
    }
  });
  const signature = signatureParams.signature;
  const getDomainSeparator = async () => {
    const domainData = biconomyForwarderDomainData;
    const domainSeparator = keccak256(
      defaultAbiCoder.encode(
        ["bytes32", "bytes32", "bytes32", "address", "bytes32"],
        [
          id(
            "EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)"
          ),
          id(domainData.name),
          id(domainData.version),
          domainData.verifyingContract,
          domainData.salt
        ]
      )
    );
    return domainSeparator;
  };
  const domainSeparator = await getDomainSeparator();
  // verify signature
  const signatureVerified = await verifyEIP712({
    request: message,
    contractAddress: biconomyForwarderDomainData.verifyingContract,
    web3Lib: args.web3Lib,
    domainSeparator,
    forwarderAbi: args.forwarderAbi,
    signature
  });
  if (!signatureVerified) {
    throw `Signature is not verified`;
  }

  return {
    to: message.to,
    domainSeparator,
    request: message,
    ...signatureParams,
    signature,
    functionSignature: args.functionSignature
  };
}

export async function relayBiconomyMetaTransaction(args: {
  web3LibAdapter: Web3LibAdapter;
  chainId: number;
  contractAddress: string;
  metaTx: {
    config: Omit<MetaTxConfig, "apiIds" | "forwarderAbi"> & { apiId: string };
    params: {
      userAddress: string;
      request: ERC20ForwardRequest;
      domainSeparator: string;
      signature: string;
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
      metaTx.params.request,
      metaTx.params.domainSeparator,
      metaTx.params.signature
    ],
    from: metaTx.params.userAddress,
    signatureType: "EIP712_SIGN"
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

export async function signMetaTxCreateSeller(
  args: BaseMetaTxArgs & {
    createSellerArgs: CreateSellerArgs;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }
) {
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.createSellerArgs.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  return signMetaTx({
    ...args,
    functionName:
      "createSeller((uint256,address,address,address,address,bool,string),(uint256,uint8),(string,uint256))",
    functionSignature: encodeCreateSeller(args.createSellerArgs)
  });
}

export async function signMetaTxUpdateSeller(
  args: BaseMetaTxArgs & {
    updateSellerArgs: UpdateSellerArgs;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }
) {
  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.updateSellerArgs.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });
  return signMetaTx({
    ...args,
    functionName:
      "updateSeller((uint256,address,address,address,address,bool,string),(uint256,uint8))",
    functionSignature: encodeUpdateSeller(args.updateSellerArgs)
  });
}

export async function signMetaTxOptInToSellerUpdate(
  args: BaseMetaTxArgs & {
    optInToSellerUpdateArgs: OptInToSellerUpdateArgs;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "optInToSellerUpdate(uint256,uint8[])",
    functionSignature: encodeOptInToSellerUpdate(args.optInToSellerUpdateArgs)
  });
}

export async function signMetaTxCreateOffer(
  args: BaseMetaTxArgs & {
    createOfferArgs: CreateOfferArgs;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }
) {
  utils.validation.createOfferArgsSchema.validateSync(args.createOfferArgs, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.createOfferArgs.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

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
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }
) {
  for (const offerToCreate of args.createOffersArgs) {
    utils.validation.createOfferArgsSchema.validateSync(offerToCreate, {
      abortEarly: false
    });
  }

  await Promise.all(
    args.createOffersArgs.map((offerToCreate) =>
      storeMetadataOnTheGraph({
        metadataUriOrHash: offerToCreate.metadataUri,
        metadataStorage: args.metadataStorage,
        theGraphStorage: args.theGraphStorage
      })
    )
  );

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

export async function signMetaTxExtendOffer(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
    validUntil: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "extendOffer(uint256,uint256)",
    functionSignature: bosonOfferHandlerIface.encodeFunctionData(
      "extendOffer",
      [args.offerId, args.validUntil]
    )
  });
}

export async function signMetaTxExtendOfferBatch(
  args: BaseMetaTxArgs & {
    offerIds: BigNumberish[];
    validUntil: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "extendOfferBatch(uint256[],uint256)",
    functionSignature: bosonOfferHandlerIface.encodeFunctionData(
      "extendOfferBatch",
      [args.offerIds, args.validUntil]
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

export async function signMetaTxRevokeVoucher(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "revokeVoucher(uint256)",
    functionSignature: bosonExchangeHandlerIface.encodeFunctionData(
      "revokeVoucher",
      [args.exchangeId]
    )
  });
}

export async function signMetaTxCreateGroup(
  args: BaseMetaTxArgs & {
    createGroupArgs: CreateGroupArgs;
  }
) {
  return signMetaTx({
    ...args,
    functionName:
      "createGroup((uint256,uint256,uint256[]),(uint8,uint8,address,uint256,uint256,uint256))",
    functionSignature: encodeCreateGroup(args.createGroupArgs)
  });
}

export async function signMetaTxReserveRange(
  args: BaseMetaTxArgs & {
    offerId: BigNumberish;
    length: BigNumberish;
    to: string;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "reserveRange(uint256,uint256,address)",
    functionSignature: encodeReserveRange(args.offerId, args.length, args.to)
  });
}

function isLocal(chainId: number): boolean {
  const localConfigs = envConfigs["local"];
  return localConfigs.some((localConfig) => localConfig.chainId === chainId);
}

export async function signMetaTxPreMint(
  args: BaseVoucherMetaTxArgs & {
    offerId: BigNumberish;
    amount: BigNumberish;
    batchId?: BigNumberish;
    forwarderAddress?: string;
    forwarderAbi:
      | typeof abis.MockForwarderABI
      | typeof abis.BiconomyForwarderABI;
    relayerUrl: string;
  }
): Promise<SignedVoucherMetaTx> {
  const functionSignature = encodePreMint(args.offerId, args.amount);
  if (isLocal(args.chainId)) {
    return signVoucherMetaTx({
      ...args,
      forwarderAddress: args.forwarderAddress,
      functionSignature,
      forwarderAbi: args.forwarderAbi as typeof abis.MockForwarderABI
    });
  }
  const txGas = 200000 + BigNumber.from(args.amount).mul(2500).toNumber(); // ~(180000 + 2250*N) estimation on 2023/02/03
  return signBiconomyVoucherMetaTx({
    ...args,
    functionSignature,
    forwarderAbi: args.forwarderAbi as typeof abis.BiconomyForwarderABI,
    batchId: args.batchId || "0",
    txGas
  });
}

export async function signMetaTxSetApprovalForAll(
  args: BaseVoucherMetaTxArgs & {
    operator: string;
    approved: boolean;
    batchId?: BigNumberish;
    forwarderAddress?: string;
    forwarderAbi:
      | typeof abis.MockForwarderABI
      | typeof abis.BiconomyForwarderABI;
    relayerUrl: string;
  }
): Promise<SignedVoucherMetaTx> {
  const functionSignature = encodeSetApprovalForAll(
    args.operator,
    args.approved
  );
  if (isLocal(args.chainId)) {
    return signVoucherMetaTx({
      ...args,
      forwarderAddress: args.forwarderAddress,
      functionSignature,
      forwarderAbi: args.forwarderAbi as typeof abis.MockForwarderABI
    });
  }
  const txGas = 100000; // ~70000 estimation on 2023/02/03
  return signBiconomyVoucherMetaTx({
    ...args,
    functionSignature,
    forwarderAbi: args.forwarderAbi as typeof abis.BiconomyForwarderABI,
    batchId: args.batchId || "0",
    txGas
  });
}

export async function signMetaTxSetApprovalForAllToContract(
  args: BaseVoucherMetaTxArgs & {
    operator: string;
    approved: boolean;
    batchId?: BigNumberish;
    forwarderAddress?: string;
    forwarderAbi:
      | typeof abis.MockForwarderABI
      | typeof abis.BiconomyForwarderABI;
    relayerUrl: string;
  },
  overrides: {
    txGas?: number;
  } = {}
): Promise<SignedVoucherMetaTx> {
  const functionSignature = encodeSetApprovalForAllToContract(
    args.operator,
    args.approved
  );
  if (isLocal(args.chainId)) {
    return signVoucherMetaTx({
      ...args,
      forwarderAddress: args.forwarderAddress,
      functionSignature,
      forwarderAbi: args.forwarderAbi as typeof abis.MockForwarderABI
    });
  }
  const txGas = overrides.txGas || 100000; // TODO: estimate the gas needed
  return signBiconomyVoucherMetaTx({
    ...args,
    functionSignature,
    forwarderAbi: args.forwarderAbi as typeof abis.BiconomyForwarderABI,
    batchId: args.batchId || "0",
    txGas
  });
}

export async function signMetaTxCallExternalContract(
  args: BaseVoucherMetaTxArgs & {
    to: string;
    data: string;
    batchId?: BigNumberish;
    forwarderAddress?: string;
    forwarderAbi:
      | typeof abis.MockForwarderABI
      | typeof abis.BiconomyForwarderABI;
    relayerUrl: string;
  },
  overrides: {
    txGas?: number;
  } = {}
): Promise<SignedVoucherMetaTx> {
  const functionSignature = encodeCallExternalContract(args.to, args.data);
  if (isLocal(args.chainId)) {
    return signVoucherMetaTx({
      ...args,
      forwarderAddress: args.forwarderAddress,
      functionSignature,
      forwarderAbi: args.forwarderAbi as typeof abis.MockForwarderABI
    });
  }
  const txGas = overrides.txGas || 500000; // TODO: estimate the gas needed
  return signBiconomyVoucherMetaTx({
    ...args,
    functionSignature,
    forwarderAbi: args.forwarderAbi as typeof abis.BiconomyForwarderABI,
    batchId: args.batchId || "0",
    txGas
  });
}

export async function signMetaTxCreateOfferWithCondition(
  args: BaseMetaTxArgs & {
    offerToCreate: CreateOfferArgs;
    condition: ConditionStruct;
    metadataStorage?: MetadataStorage;
    theGraphStorage?: MetadataStorage;
  }
) {
  utils.validation.createOfferArgsSchema.validateSync(args.offerToCreate, {
    abortEarly: false
  });

  await storeMetadataOnTheGraph({
    metadataUriOrHash: args.offerToCreate.metadataUri,
    metadataStorage: args.metadataStorage,
    theGraphStorage: args.theGraphStorage
  });

  return signMetaTx({
    ...args,
    functionName:
      "createOfferWithCondition((uint256,uint256,uint256,uint256,uint256,uint256,address,string,string,bool),(uint256,uint256,uint256,uint256),(uint256,uint256,uint256),uint256,(uint8,uint8,address,uint256,uint256,uint256),uint256)",
    functionSignature: encodeCreateOfferWithCondition(
      args.offerToCreate,
      args.condition
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
  return makeExchangeMetaTxSigner(
    "retractDispute(uint256)",
    bosonDisputeHandlerIface
  )(args);
}

export async function signMetaTxEscalateDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner(
    "escalateDispute(uint256)",
    bosonDisputeHandlerIface
  )(args);
}

export async function signMetaTxRaiseDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
  }
) {
  return makeExchangeMetaTxSigner(
    "raiseDispute(uint256)",
    bosonDisputeHandlerIface
  )(args);
}

export async function signMetaTxResolveDispute(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
    buyerPercent: BigNumberish;
    counterpartySig: {
      r: string;
      s: string;
      v: number;
    };
  }
): Promise<SignedMetaTx> {
  const functionName = "resolveDispute(uint256,uint256,bytes32,bytes32,uint8)";

  const disputeResolutionType = [
    { name: "exchangeId", type: "uint256" },
    { name: "buyerPercentBasisPoints", type: "uint256" },
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
    functionName,
    disputeResolutionDetails: {
      exchangeId: args.exchangeId.toString(),
      buyerPercentBasisPoints: args.buyerPercent.toString(),
      sigR: args.counterpartySig.r,
      sigS: args.counterpartySig.s,
      sigV: args.counterpartySig.v
    }
  };

  const signatureParams = await prepareDataSignatureParameters({
    ...args,
    verifyingContractAddress: args.metaTxHandlerAddress,
    customSignatureType,
    primaryType: "MetaTxDisputeResolution",
    message
  });

  return {
    ...signatureParams,
    functionName,
    functionSignature: bosonDisputeHandlerIface.encodeFunctionData(
      // remove params in brackets from string
      functionName.replace(/\(([^)]*)\)[^(]*$/, ""),
      [
        args.exchangeId,
        args.buyerPercent,
        args.counterpartySig.r,
        args.counterpartySig.s,
        args.counterpartySig.v
      ]
    )
  };
}

export async function signMetaTxExtendDisputeTimeout(
  args: BaseMetaTxArgs & {
    exchangeId: BigNumberish;
    newTimeout: BigNumberish;
  }
) {
  return signMetaTx({
    ...args,
    functionName: "extendDisputeTimeout(uint256,uint256)",
    functionSignature: bosonDisputeHandlerIface.encodeFunctionData(
      "extendDisputeTimeout",
      [args.exchangeId, args.newTimeout]
    )
  });
}

export async function signMetaTxWithdrawFunds(
  args: BaseMetaTxArgs & {
    entityId: BigNumberish;
    tokenList: string[];
    tokenAmounts: BigNumberish[];
  }
): Promise<SignedMetaTx> {
  const functionName = "withdrawFunds(uint256,address[],uint256[])";

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
      entityId: args.entityId.toString(),
      tokenList: args.tokenList,
      tokenAmounts: args.tokenAmounts.map((bn) => bn.toString())
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
    functionSignature: encodeWithdrawFunds(
      args.entityId,
      args.tokenList,
      args.tokenAmounts
    )
  };
}

export async function signMetaTxDepositFunds(
  args: BaseMetaTxArgs & {
    sellerId: BigNumberish;
    fundsTokenAddress: string;
    fundsAmount: BigNumberish;
  }
) {
  if (!isAddress(args.fundsTokenAddress)) {
    throw new Error(`Invalid fundsTokenAddress: ${args.fundsTokenAddress}`);
  }

  if (args.fundsTokenAddress === AddressZero) {
    throw new Error(
      `Meta transaction can't be used to deposit native currency`
    );
  }

  return signMetaTx({
    ...args,
    functionName: "depositFunds(uint256,address,uint256)",
    functionSignature: encodeDepositFunds(
      args.sellerId,
      args.fundsTokenAddress,
      args.fundsAmount
    )
  });
}

function makeExchangeMetaTxSigner(
  functionName:
    | "cancelVoucher(uint256)"
    | "redeemVoucher(uint256)"
    | "completeExchange(uint256)"
    | "retractDispute(uint256)"
    | "escalateDispute(uint256)"
    | "raiseDispute(uint256)",
  handlerIface = bosonExchangeHandlerIface
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
      functionSignature: handlerIface.encodeFunctionData(
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
    config: Omit<MetaTxConfig, "apiIds" | "forwarderAbi"> & { apiId: string };
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
      console.log("[relayBiconomyMetaTransaction.wait] txReceipt", txReceipt);
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
