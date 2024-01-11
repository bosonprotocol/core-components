import { GraphQLClient, gql } from "graphql-request";
import { AddressZero } from "@ethersproject/constants";
import {
  ConditionStruct,
  CreateSellerArgs,
  TransactionResponse,
  TransactionReceipt
} from "../../packages/common/src/index";
import {
  providers,
  Wallet,
  utils,
  Contract,
  BigNumber,
  BigNumberish
} from "ethers";
import {
  CoreSDK,
  getEnvConfigs,
  accounts,
  MetadataType
} from "../../packages/core-sdk/src";
import { base, seller } from "../../packages/metadata/src";
import {
  BaseIpfsStorage,
  IpfsMetadataStorage
} from "../../packages/ipfs-storage/src";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { CreateOfferArgs } from "./../../packages/common/src/types/offers";
import { mockCreateOfferArgs } from "../../packages/common/tests/mocks";
import {
  ACCOUNT_1,
  ACCOUNT_2,
  ACCOUNT_3,
  ACCOUNT_4,
  ACCOUNT_5,
  ACCOUNT_6,
  ACCOUNT_7,
  ACCOUNT_8,
  ACCOUNT_9,
  ACCOUNT_10,
  ACCOUNT_11,
  ACCOUNT_12,
  ACCOUNT_13,
  ACCOUNT_14,
  ACCOUNT_15,
  ACCOUNT_16,
  ACCOUNT_17,
  ACCOUNT_18,
  ACCOUNT_19,
  ACCOUNT_20,
  ACCOUNT_21
} from "../../contracts/accounts";
import {
  MOCK_ERC1155_ABI,
  MOCK_ERC20_ABI,
  MOCK_ERC721_ABI,
  MOCK_NFT_AUTH_721_ABI
} from "./mockAbis";
import { SellerFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { ZERO_ADDRESS } from "../../packages/core-sdk/tests/mocks";
import { sortObjKeys } from "../../packages/ipfs-storage/src/utils";

const getFirstEnvConfig = (arg0: Parameters<typeof getEnvConfigs>[0]) =>
  getEnvConfigs(arg0)[0];

export const MOCK_ERC20_ADDRESS =
  (getFirstEnvConfig("local").contracts.testErc20 as string) ||
  "0x998abeb3E57409262aE5b751f60747921B33613E";

export const MOCK_ERC721_ADDRESS =
  (getFirstEnvConfig("local").contracts.testErc721 as string) ||
  "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";

export const MOCK_ERC1155_ADDRESS =
  (getFirstEnvConfig("local").contracts.testErc1155 as string) ||
  "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";

export const MOCK_FORWARDER_ADDRESS =
  (getFirstEnvConfig("local").contracts.forwarder as string) ||
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const MOCK_SEAPORT_ADDRESS =
  (getFirstEnvConfig("local").contracts.seaport as string) ||
  "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF";

export const metadata = {
  name: "name",
  description: "description",
  externalUrl: "external-url.com",
  animationUrl: "animation-url.com",
  animationMetadata: {
    height: 720,
    width: 404,
    type: "video/mp4"
  },
  licenseUrl: "license-url.com",
  schemaUrl: "schema-url.com"
};
export const sellerMetadata = {
  name: "sellerMetadataName",
  description: "description",
  legalTradingName: "legalTradingName",
  type: "SELLER" as const,
  kind: "lens",
  website: "website",
  images: [
    {
      url: "url",
      tag: "tag",
      type: "image/jpeg",
      width: 505,
      height: 393
    }
  ],
  contactLinks: [
    {
      url: "url",
      tag: "tag"
    }
  ],
  contactPreference: "xmtp",
  socialLinks: [
    {
      url: "url",
      tag: "tag"
    }
  ],
  salesChannels: [
    {
      tag: "DCL",
      settingsUri: "file://dclsettings",
      settingsEditor: "https://jsonformatter.org/json-editor",
      deployments: []
    }
  ]
};
export const sellerFundsDepositInEth = "5";

export const defaultConfig = getFirstEnvConfig("local");

export const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
// seedWallets used by accounts test
export const deployerWallet = new Wallet(ACCOUNT_1.privateKey, provider);
export const seedWallet3 = new Wallet(ACCOUNT_3.privateKey, provider);
// seedWallets used by core-sdk test
export const drWallet = new Wallet(ACCOUNT_2.privateKey, provider);
export const seedWallet4 = new Wallet(ACCOUNT_4.privateKey, provider);
export const seedWallet5 = new Wallet(ACCOUNT_5.privateKey, provider);
export const seedWallet6 = new Wallet(ACCOUNT_6.privateKey, provider);
// seedWallets used by meta-tx test
export const seedWallet7 = new Wallet(ACCOUNT_7.privateKey, provider);
export const seedWallet8 = new Wallet(ACCOUNT_8.privateKey, provider);
export const seedWallet9 = new Wallet(ACCOUNT_9.privateKey, provider);
export const seedWallet11 = new Wallet(ACCOUNT_11.privateKey, provider);
export const seedWallet13 = new Wallet(ACCOUNT_13.privateKey, provider);
// seedWallets used by native-meta-tx test
export const seedWallet12 = new Wallet(ACCOUNT_12.privateKey, provider);
// seedWallets used by productV1 test
export const seedWallet10 = new Wallet(ACCOUNT_10.privateKey, provider);
// seedWallets used by core-sdk-premint test
export const seedWallet14 = new Wallet(ACCOUNT_14.privateKey, provider);
export const seedWallet15 = new Wallet(ACCOUNT_15.privateKey, provider);
// seedWallets used by core-sdk-extend-offer test
export const seedWallet16 = new Wallet(ACCOUNT_16.privateKey, provider);
export const seedWallet17 = new Wallet(ACCOUNT_17.privateKey, provider);
// seedWallets used by core-sdk-set-contract-uri
export const seedWallet18 = new Wallet(ACCOUNT_18.privateKey, provider);
// seedWallets used by core-sdk-set-contract-uri
export const seedWallet19 = new Wallet(ACCOUNT_19.privateKey, provider);
// seedWallets used by core-sdk-collections
export const seedWallet20 = new Wallet(ACCOUNT_20.privateKey, provider);
// seedWallets used by core-sdk-accounts
export const seedWallet21 = new Wallet(ACCOUNT_21.privateKey, provider);

export const mockErc20Contract = new Contract(
  MOCK_ERC20_ADDRESS,
  MOCK_ERC20_ABI,
  provider
);
export const mockErc721Contract = new Contract(
  MOCK_ERC721_ADDRESS,
  MOCK_ERC721_ABI,
  provider
);

export const mockErc1155Contract = new Contract(
  MOCK_ERC1155_ADDRESS,
  MOCK_ERC1155_ABI,
  provider
);

export const ipfsMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.ipfsMetadataUrl
});
export const graphMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.theGraphIpfsUrl
});

export async function initSellerAndBuyerSDKs(seedWallet: Wallet) {
  const { coreSDK: sellerCoreSDK, fundedWallet: sellerWallet } =
    await initCoreSDKWithFundedWallet(seedWallet);
  const { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet } =
    await initCoreSDKWithFundedWallet(seedWallet);

  return {
    sellerCoreSDK,
    buyerCoreSDK,
    sellerWallet,
    buyerWallet
  };
}

export async function initCoreSDKWithFundedWallet(seedWallet: Wallet) {
  const fundedWallet = await createFundedWallet(seedWallet);
  const coreSDK = initCoreSDKWithWallet(fundedWallet);
  return { coreSDK, fundedWallet };
}

export function initCoreSDKWithWallet(wallet: Wallet) {
  const envName = "local";
  const configId = "local-31337-0";
  const defaultConfig = getFirstEnvConfig(envName);
  const protocolAddress = defaultConfig.contracts.protocolDiamond;
  const testErc20Address = defaultConfig.contracts.testErc20 as string;
  const apiIds = {
    [protocolAddress.toLowerCase()]: {
      executeMetaTransaction: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    },
    [testErc20Address.toLowerCase()]: {
      executeMetaTransaction: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  };
  return CoreSDK.fromDefaultConfig({
    envName,
    configId,
    web3Lib: new EthersAdapter(provider, wallet),
    metadataStorage: ipfsMetadataStorage,
    theGraphStorage: graphMetadataStorage,
    metaTx: {
      apiKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      apiIds
    }
  });
}

export async function waitForGraphNodeIndexing(
  blockNumberOrTransaction?: number | TransactionResponse | TransactionReceipt
) {
  let blockToWaitFor = 0;
  if (typeof blockNumberOrTransaction === "number") {
    blockToWaitFor = blockNumberOrTransaction;
  } else if (blockNumberOrTransaction?.["blockNumber"]) {
    blockToWaitFor = (blockNumberOrTransaction as TransactionReceipt)
      .blockNumber;
  } else if (blockNumberOrTransaction?.["wait"]) {
    const txReceipt = await (
      blockNumberOrTransaction as TransactionResponse
    ).wait();
    blockToWaitFor = txReceipt.blockNumber;
  }
  if (blockToWaitFor > 0) {
    let currentBlock = await getSubgraphBlockNumber();
    while (currentBlock < blockToWaitFor) {
      await wait(200);
      currentBlock = await getSubgraphBlockNumber();
    }
    return;
  }
  await wait(3_000);
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function createFundedWallet(
  fundingWallet: Wallet,
  fundAmountInEth = "10"
) {
  const fundedWallet = Wallet.createRandom().connect(provider);
  const fundingTx = await fundingWallet.sendTransaction({
    value: utils.parseEther(fundAmountInEth),
    to: fundedWallet.address
  });
  await fundingTx.wait();

  return fundedWallet;
}

export async function ensureCreatedSeller(sellerWallet: Wallet) {
  const sellerAddress = sellerWallet.address;
  const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
  let sellers = await sellerCoreSDK.getSellersByAddress(sellerAddress);
  const sellerMetadataUri = await getSellerMetadataUri(sellerCoreSDK);
  const contractUri = await getCollectionMetadataUri(sellerCoreSDK);

  if (!sellers.length) {
    const tx = await sellerCoreSDK.createSeller({
      assistant: sellerAddress,
      treasury: sellerAddress,
      admin: sellerAddress,
      contractUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0,
      metadataUri: sellerMetadataUri
    });
    await tx.wait();
    await waitForGraphNodeIndexing(tx);
    sellers = await sellerCoreSDK.getSellersByAddress(sellerAddress);
  }

  return sellers;
}

export async function ensureMintedAndAllowedTokens(
  wallets: Wallet[],
  mintAmountInEth: BigNumberish = 1_000_000,
  approve = true
) {
  const mintAmountWei = utils.parseEther(mintAmountInEth.toString());
  const walletBalances = await Promise.all(
    wallets.map((wallet) => mockErc20Contract.balanceOf(wallet.address))
  );

  if (walletBalances.some((balance) => BigNumber.from(balance).eq(0))) {
    // Mint tokens
    const mintTxResponses = await Promise.all(
      wallets.map((wallet) =>
        mockErc20Contract.connect(wallet).mint(wallet.address, mintAmountWei)
      )
    );
    await Promise.all(mintTxResponses.map((txResponse) => txResponse.wait()));

    if (approve) {
      // Allow tokens
      const allowTxResponses = await Promise.all(
        wallets.map((wallet) =>
          initCoreSDKWithWallet(wallet).approveExchangeToken(
            MOCK_ERC20_ADDRESS,
            mintAmountWei
          )
        )
      );
      await Promise.all(
        allowTxResponses.map((txResponse) => txResponse.wait())
      );
    }
  }
}

export async function ensureMintedERC721(
  wallet: Wallet,
  tokenId: BigNumberish
) {
  const tx = await mockErc721Contract.connect(wallet).mint(tokenId, 1);
  await tx.wait();
}

export async function ensureMintedERC1155(
  wallet: Wallet,
  tokenId: BigNumberish,
  amount: BigNumberish
) {
  const tx = await mockErc1155Contract.connect(wallet).mint(tokenId, amount);
  await tx.wait();
}

export async function createDisputeResolver(
  drWallet: Wallet,
  protocolWallet: Wallet,
  disputeResolverToCreate: accounts.CreateDisputeResolverArgs
) {
  const drCoreSDK = initCoreSDKWithWallet(drWallet);
  const protocolAdminCoreSDK = initCoreSDKWithWallet(protocolWallet);
  const receipt = await (
    await drCoreSDK.createDisputeResolver(disputeResolverToCreate)
  ).wait();

  const disputeResolverId = drCoreSDK.getDisputeResolverIdFromLogs(
    receipt.logs
  );

  if (!disputeResolverId) {
    throw new Error("Failed to create dispute resolver");
  }

  await waitForGraphNodeIndexing(receipt);

  const disputeResolver = await drCoreSDK.getDisputeResolverById(
    disputeResolverId
  );

  return {
    disputeResolverId,
    disputeResolver,
    protocolAdminCoreSDK,
    disputeResolverCoreSDK: drCoreSDK
  };
}

export async function createOffer(
  coreSDK: CoreSDK,
  offerParams?: Partial<CreateOfferArgs>
) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE"
  });
  const metadataUri = "ipfs://" + metadataHash;

  const offerArgs = mockCreateOfferArgs({
    metadataHash,
    metadataUri,
    ...offerParams
  });

  const createOfferTxResponse = await coreSDK.createOffer(offerArgs);
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createOfferWithCondition(
  coreSDK: CoreSDK,
  condition: ConditionStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<base.BaseMetadata>;
  } = {}
) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE",
    ...overrides.metadata
  });
  const metadataUri = "ipfs://" + metadataHash;

  const offerArgs = mockCreateOfferArgs({
    metadataHash,
    metadataUri,
    ...overrides.offerParams
  });

  const createOfferTxResponse = await coreSDK.createOfferWithCondition(
    offerArgs,
    condition
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createSellerAndOfferWithCondition(
  coreSDK: CoreSDK,
  sellerAddress: string,
  condition: ConditionStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<base.BaseMetadata>;
    sellerMetadata?: Partial<seller.SellerMetadata>;
  } = {}
) {
  const contractHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE",
    ...overrides.metadata
  });
  const contractUri = "ipfs://" + contractHash;
  const metadataHash = await coreSDK.storeMetadata({
    ...sellerMetadata,
    ...overrides.sellerMetadata
  });
  const metadataUri = "ipfs://" + metadataHash;

  const createOfferTxResponse = await coreSDK.createSellerAndOfferWithCondition(
    {
      assistant: sellerAddress,
      admin: sellerAddress,
      treasury: sellerAddress,
      contractUri: contractUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0,
      metadataUri: metadataUri
    },
    mockCreateOfferArgs({
      metadataHash: contractHash,
      metadataUri: contractUri,
      ...overrides.offerParams
    }),
    condition
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );
  if (createdOfferId === null) {
    throw new Error("Failed to create offer with condition");
  }
  await waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId);

  return offer;
}

export async function createSeller(
  coreSDK: CoreSDK,
  sellerAddress: string,
  overrides: {
    sellerParams?: Partial<CreateSellerArgs>;
    sellerMetadata?: Partial<seller.SellerMetadata>;
  } = {}
) {
  const metadataHash = await coreSDK.storeMetadata({
    ...sellerMetadata,
    ...overrides.sellerMetadata
  });
  const metadataUri = "ipfs://" + metadataHash;
  const contractUri = await getCollectionMetadataUri(coreSDK);
  const createSellerTxResponse = await coreSDK.createSeller({
    assistant: sellerAddress,
    admin: sellerAddress,
    treasury: sellerAddress,
    contractUri,
    royaltyPercentage: "0",
    authTokenId: "0",
    authTokenType: 0,
    metadataUri,
    ...overrides.sellerParams
  });
  const createSellerTxReceipt = await createSellerTxResponse.wait();
  const createdSellerId = coreSDK.getCreatedSellerIdFromLogs(
    createSellerTxReceipt.logs
  );

  await waitForGraphNodeIndexing(createSellerTxReceipt);
  if (createdSellerId === null) {
    throw new Error("Failed to create seller");
  }
  const seller = await coreSDK.getSellerById(createdSellerId);

  return seller;
}

export async function updateSeller(
  coreSDK: CoreSDK,
  seller: SellerFieldsFragment,
  sellerParams: Partial<CreateSellerArgs>,
  optInSequence: {
    coreSDK: CoreSDK;
    fieldsToUpdate: {
      assistant?: boolean;
      clerk?: boolean;
      admin?: boolean;
      authToken?: boolean;
    };
  }[] = []
) {
  const updatedSellerTxResponse = await coreSDK.updateSellerAndOptIn({
    ...seller,
    ...sellerParams
  });
  await updatedSellerTxResponse.wait();
  const optInTxs: TransactionResponse[] = [];
  for (const optIn of optInSequence) {
    optInTxs.push(
      await optIn.coreSDK.optInToSellerUpdate({
        id: seller.id,
        fieldsToUpdate: optIn.fieldsToUpdate
      })
    );
  }
  const receipts = await Promise.all(optInTxs.map((tx) => tx.wait()));
  const maxBlockNum = receipts.reduce(
    (max, receipt) => Math.max(max, receipt.blockNumber),
    0
  );
  await waitForGraphNodeIndexing(maxBlockNum);
  const updatedSeller = await coreSDK.getSellerById(seller.id as string);
  return updatedSeller;
}

export async function updateSellerMetaTx(
  coreSDK: CoreSDK,
  seller: SellerFieldsFragment,
  sellerParams: Partial<CreateSellerArgs>,
  optInSequence: {
    coreSDK: CoreSDK;
    fieldsToUpdate: {
      assistant?: boolean;
      clerk?: boolean;
      admin?: boolean;
      authToken?: boolean;
    };
  }[] = []
) {
  const updatedSellerTxResponse = await coreSDK.signMetaTxUpdateSellerAndOptIn({
    ...seller,
    ...sellerParams
  });
  await updatedSellerTxResponse.wait();
  const optInTxs: TransactionResponse[] = [];
  for (const optIn of optInSequence) {
    const nonce = Date.now();
    const optInMetaTx = await optIn.coreSDK.signMetaTxOptInToSellerUpdate({
      optInToSellerUpdateArgs: {
        id: seller.id,
        fieldsToUpdate: optIn.fieldsToUpdate
      },
      nonce
    });
    optInTxs.push(
      await optIn.coreSDK.relayMetaTransaction({
        functionName: optInMetaTx.functionName,
        functionSignature: optInMetaTx.functionSignature,
        sigR: optInMetaTx.r,
        sigS: optInMetaTx.s,
        sigV: optInMetaTx.v,
        nonce
      })
    );
  }
  const receipts = await Promise.all(optInTxs.map((tx) => tx.wait()));
  const maxBlockNum = receipts.reduce(
    (max, receipt) => Math.max(max, receipt.blockNumber),
    0
  );
  await waitForGraphNodeIndexing(maxBlockNum);
  const updatedSeller = await coreSDK.getSellerById(seller.id as string);
  return updatedSeller;
}

export async function getSellerMetadataUri(coreSDK: CoreSDK) {
  const sellerMetadataHash = await coreSDK.storeMetadata({
    ...sellerMetadata
  });
  const sellerMetadataUri = "ipfs://" + sellerMetadataHash;
  return sellerMetadataUri;
}

export async function getCollectionMetadataUri(coreSDK: CoreSDK) {
  const collectionMetadataHash = await coreSDK.storeMetadata({
    type: MetadataType.COLLECTION,
    name: "MyCollection",
    description: "MyCollection",
    external_link: "external-url.com"
  });
  const collectionMetadataUri = "ipfs://" + collectionMetadataHash;
  return collectionMetadataUri;
}

export async function createSellerAndOffer(
  coreSDK: CoreSDK,
  sellerAddress: string,
  offerOverrides?: Partial<CreateOfferArgs>
) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE"
  });
  const metadataUri = "ipfs://" + metadataHash;
  const sellerMetadataUri = await getSellerMetadataUri(coreSDK);
  const contractUri = await getCollectionMetadataUri(coreSDK);
  const createOfferTxResponse = await coreSDK.createSellerAndOffer(
    {
      assistant: sellerAddress,
      admin: sellerAddress,
      treasury: sellerAddress,
      contractUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0,
      metadataUri: sellerMetadataUri
    },
    mockCreateOfferArgs({
      metadataHash,
      metadataUri,
      ...offerOverrides
    })
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );
  if (createdOfferId === null) {
    throw new Error("Failed to create offer");
  }
  await waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId);

  return offer;
}

export async function mintLensToken(
  wallet: Wallet,
  to: string
): Promise<BigNumberish> {
  const defaultConfig = getFirstEnvConfig("local");
  const lensContractAddress = defaultConfig.lens?.LENS_HUB_CONTRACT as string;

  const lensContract = new Contract(
    lensContractAddress,
    MOCK_NFT_AUTH_721_ABI,
    provider
  );
  // find a tokenId that is not minted yet
  let tokenId = Date.now();
  let ownerOf = "NOT_ZERO_ADDRESS";
  while (ownerOf !== ZERO_ADDRESS) {
    try {
      ownerOf = await lensContract.ownerOf(tokenId);
      tokenId++;
    } catch {
      ownerOf = ZERO_ADDRESS;
    }
  }

  // Mint the token in the mocked LENS contract for the future seller
  const tx = await lensContract.connect(wallet).mint(to, tokenId);
  await tx.wait();

  return tokenId;
}

export function createSeaportOrder(args: {
  offerer: string;
  token: string;
  tokenId: string;
  openseaTreasury: string;
}) {
  const offers = [
    {
      itemType: 2,
      token: args.token,
      identifierOrCriteria: args.tokenId,
      startAmount: "1",
      endAmount: "1"
    }
  ];
  const considerations = [
    {
      itemType: 0,
      token: AddressZero,
      identifierOrCriteria: 0,
      startAmount: "97500000000000000",
      endAmount: "97500000000000000",
      recipient: args.offerer
    },
    {
      itemType: 0,
      token: AddressZero,
      identifierOrCriteria: 0,
      startAmount: "2500000000000000",
      endAmount: "2500000000000000",
      recipient: args.openseaTreasury
    }
  ];
  return {
    parameters: {
      offerer: args.offerer,
      zone: AddressZero,
      offer: offers,
      consideration: considerations,
      orderType: 0,
      startTime: "1675770013",
      endTime: "1678735278",
      zoneHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      salt: "0x000000001af963065187d481",
      conduitKey:
        "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      totalOriginalConsiderationItems: considerations.length,
      counter: 0
    },
    signature: "0x" // no signature required if the transaction is sent by the offerer
  };
}

export async function commitToOffer(args: {
  buyerCoreSDK: CoreSDK;
  sellerCoreSDK: CoreSDK;
  offerId: BigNumberish;
}) {
  const commitToOfferTxResponse = await args.buyerCoreSDK.commitToOffer(
    args.offerId
  );
  const commitToOfferTxReceipt = await commitToOfferTxResponse.wait();
  const exchangeId = args.buyerCoreSDK.getCommittedExchangeIdFromLogs(
    commitToOfferTxReceipt.logs
  );
  if (!exchangeId) {
    throw new Error("exchangeId is not defined");
  }
  await waitForGraphNodeIndexing(commitToOfferTxReceipt);
  const exchange = await args.buyerCoreSDK.getExchangeById(exchangeId);
  return exchange;
}

export async function publishNftContractMetadata(
  coreSDK: CoreSDK,
  metadata: Record<string, unknown>
): Promise<string> {
  const ipfsStorage = new BaseIpfsStorage({
    url: getFirstEnvConfig("local").ipfsMetadataUrl
  });
  const metadataWithSortedKeys = sortObjKeys(metadata);
  const cid = await ipfsStorage.add(JSON.stringify(metadataWithSortedKeys));
  return "ipfs://" + cid;
}

export async function getSubgraphBlockNumber(): Promise<number> {
  const client = new GraphQLClient(getFirstEnvConfig("local").subgraphUrl);
  const response = await client.request(gql`
    query MyQuery {
      _meta {
        block {
          number
        }
      }
    }
  `);
  return response?._meta?.block?.number || 0;
}
