import { GraphQLClient, gql } from "graphql-request";
import { AddressZero } from "@ethersproject/constants";
import {
  ConditionStruct,
  CreateSellerArgs,
  TransactionResponse
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
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import {
  CoreSDK,
  getEnvConfigs,
  accounts,
  MetadataType,
  subgraph
} from "../../packages/core-sdk/src";
import {
  AnyMetadata,
  base,
  buildUuid,
  bundle,
  productV1,
  productV1Item,
  nftItem,
  seller,
  validateMetadata
} from "../../packages/metadata/src";
import {
  BaseIpfsStorage,
  IpfsMetadataStorage
} from "../../packages/ipfs-storage/src";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import {
  CreateOfferArgs,
  PremintParametersStruct
} from "./../../packages/common/src/types/offers";
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
  ACCOUNT_21,
  ACCOUNT_22,
  ACCOUNT_23,
  ACCOUNT_24
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
import productV1ValidMinimalOffer from "../../scripts/assets/offer_1.metadata.json";
import bundleMetadataMinimal from "../../packages/metadata/tests/bundle/valid/minimal.json";
import { Chain, OpenSeaSDK } from "opensea-js";
import { Seaport } from "@opensea/seaport-js";
import { hexlify, randomBytes } from "ethers/lib/utils";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

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

export const OPENSEA_FEE_RECIPIENT =
  "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

export const OPENSEA_WRAPPER_FACTORY =
  (getFirstEnvConfig("local").contracts.openseaWrapper as string) ||
  "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf";

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
// seedWallets used by bundle.test.ts
export const seedWallet22 = new Wallet(ACCOUNT_22.privateKey, provider);
// seedWallets used by core-sdk-royalties.test.ts
export const seedWallet23 = new Wallet(ACCOUNT_23.privateKey, provider);
// seedWallets used by opensea-price-discovery.test.ts
export const seedWallet24 = new Wallet(ACCOUNT_24.privateKey, provider);

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

export const ipfsMetadataStorage = new IpfsMetadataStorage(validateMetadata, {
  url: defaultConfig.ipfsMetadataUrl
});
export const graphMetadataStorage = new IpfsMetadataStorage(validateMetadata, {
  url: defaultConfig.theGraphIpfsUrl
});

export const META_TX_API_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
export const META_TX_API_ID_BOSON = "xxxxxxxx-xxxx-xxxx-xxxx-111111111111";
export const META_TX_API_ID_ERC20s = "xxxxxxxx-xxxx-xxxx-xxxx-333333333333";
export const META_TX_API_ID_VOUCHER = "xxxxxxxx-xxxx-xxxx-xxxx-444444444444";

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

export function initCoreSDKWithWallet(wallet: Wallet | undefined) {
  const envName = "local";
  const configId = "local-31337-0";
  const defaultConfig = getFirstEnvConfig(envName);
  const protocolAddress = defaultConfig.contracts.protocolDiamond;
  const testErc20Address = defaultConfig.contracts.testErc20 as string;
  const apiIds = {
    [protocolAddress.toLowerCase()]: {
      executeMetaTransaction: META_TX_API_ID_BOSON
    },
    [testErc20Address.toLowerCase()]: {
      executeMetaTransaction: META_TX_API_ID_ERC20s
    }
  };
  return CoreSDK.fromDefaultConfig({
    envName,
    configId,
    web3Lib: new EthersAdapter(provider, wallet),
    metadataStorage: ipfsMetadataStorage,
    theGraphStorage: graphMetadataStorage,
    metaTx: {
      apiKey: META_TX_API_KEY,
      apiIds
    }
  });
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createRandomWallet() {
  return new Wallet(hexlify(randomBytes(32)));
}

export async function createFundedWallet(
  fundingWallet: Wallet,
  fundAmountInEth = "10"
) {
  const fundedWallet = createRandomWallet().connect(provider);
  const fundingTx = await fundingWallet.sendTransaction({
    value: utils.parseEther(fundAmountInEth),
    to: fundedWallet.address
  });
  await fundingTx.wait();

  return fundedWallet;
}

export async function doItAgain<T>(
  nbOfTries: number,
  f: () => Promise<T>
): Promise<T> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const ret = await f();
      return ret;
    } catch (e) {
      if (--nbOfTries <= 0) {
        throw e;
      }
    }
  }
}

export async function ensureCreatedSeller(sellerWallet: Wallet) {
  const sellerAddress = sellerWallet.address;
  const sellerCoreSDK = initCoreSDKWithWallet(sellerWallet);
  let sellers = await sellerCoreSDK.getSellersByAddress(sellerAddress);
  const sellerMetadataUri = await getSellerMetadataUri(sellerCoreSDK);
  const contractUri = await getCollectionMetadataUri(sellerCoreSDK);

  if (!sellers.length) {
    const tx = await doItAgain(2, async () => {
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
      return tx;
    });
    await sellerCoreSDK.waitForGraphNodeIndexing(tx);
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

  await drCoreSDK.waitForGraphNodeIndexing(receipt);

  const disputeResolver =
    await drCoreSDK.getDisputeResolverById(disputeResolverId);

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

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createOffer2(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  offerArgs: CreateOfferArgs
) {
  const sellers = await ensureCreatedSeller(sellerWallet);
  const [seller] = sellers;
  // Check the disputeResolver exists and is active
  const disputeResolverId = offerArgs.disputeResolverId;

  const dr = await coreSDK.getDisputeResolverById(disputeResolverId);
  expect(dr).toBeTruthy();
  expect(dr.active).toBe(true);
  expect(
    dr.sellerAllowList.length == 0 || dr.sellerAllowList.indexOf(seller.id) >= 0
  ).toBe(true);
  const createOfferTxResponse = await coreSDK.createOffer(offerArgs);
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);

  return await coreSDK.getOfferById(createdOfferId as string);
}

export async function voidOfferBatch(coreSDK: CoreSDK, offerIds: string[]) {
  const tx = await coreSDK.voidOfferBatch(offerIds);
  await coreSDK.waitForGraphNodeIndexing(tx);
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

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createPremintedOfferWithCondition(
  coreSDK: CoreSDK,
  condition: ConditionStruct,
  premintParameters: PremintParametersStruct,
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

  const createOfferTxResponse = await coreSDK.createPremintedOfferWithCondition(
    offerArgs,
    premintParameters,
    condition
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createPremintedOfferAddToGroup(
  coreSDK: CoreSDK,
  condition: ConditionStruct,
  premintParameters: PremintParametersStruct,
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
  const groupToCreate = {
    offerIds: [],
    ...condition
  };
  const createdGroupTx = await coreSDK.createGroup(groupToCreate);
  const txReceipt = await createdGroupTx.wait();
  const createdGroupIds = await coreSDK.getCreatedGroupIdsFromLogs(
    txReceipt.logs
  );
  expect(createdGroupIds.length).toEqual(1);
  const [groupId] = createdGroupIds;

  const createOfferTxResponse = await coreSDK.createPremintedOfferAddToGroup(
    offerArgs,
    premintParameters,
    groupId
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return { offer, groupId };
}

export async function createSellerAndPremintedOffer(
  coreSDK: CoreSDK,
  sellerAddress: string,
  premintParameters: PremintParametersStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<base.BaseMetadata>;
    sellerMetadata?: Partial<seller.SellerMetadata>;
  } = {}
) {
  const sellerContractHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE",
    ...overrides.metadata
  });
  const sellerContractUri = "ipfs://" + sellerContractHash;
  const sellerMetadataHash = await coreSDK.storeMetadata({
    ...sellerMetadata,
    ...overrides.sellerMetadata
  });
  const sellerMetadataUri = "ipfs://" + sellerMetadataHash;

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

  const txResponse = await coreSDK.createSellerAndPremintedOffer(
    {
      assistant: sellerAddress,
      admin: sellerAddress,
      treasury: sellerAddress,
      contractUri: sellerContractUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0,
      metadataUri: sellerMetadataUri
    },
    offerArgs,
    premintParameters
  );
  const txReceipt = await txResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);
  if (createdOfferId === null) {
    throw new Error("Failed to create seller adn preminted offer");
  }
  await coreSDK.waitForGraphNodeIndexing(txReceipt);
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createSellerAndPremintedOfferWithCondition(
  coreSDK: CoreSDK,
  sellerAddress: string,
  condition: ConditionStruct,
  premintParameters: PremintParametersStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<base.BaseMetadata>;
    sellerMetadata?: Partial<seller.SellerMetadata>;
  } = {}
) {
  const sellerContractHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE",
    ...overrides.metadata
  });
  const sellerContractUri = "ipfs://" + sellerContractHash;
  const sellerMetadataHash = await coreSDK.storeMetadata({
    ...sellerMetadata,
    ...overrides.sellerMetadata
  });
  const sellerMetadataUri = "ipfs://" + sellerMetadataHash;

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

  const txResponse = await coreSDK.createSellerAndPremintedOfferWithCondition(
    {
      assistant: sellerAddress,
      admin: sellerAddress,
      treasury: sellerAddress,
      contractUri: sellerContractUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0,
      metadataUri: sellerMetadataUri
    },
    offerArgs,
    premintParameters,
    condition
  );
  const txReceipt = await txResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(txReceipt.logs);
  if (createdOfferId === null) {
    throw new Error("Failed to create seller adn preminted offer");
  }
  await coreSDK.waitForGraphNodeIndexing(txReceipt);
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
  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
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
  const createSellerTxReceipt = await doItAgain(2, async () => {
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
    return createSellerTxReceipt;
  });

  const createdSellerId = coreSDK.getCreatedSellerIdFromLogs(
    createSellerTxReceipt.logs
  );
  await coreSDK.waitForGraphNodeIndexing(createSellerTxReceipt);
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
  await coreSDK.waitForGraphNodeIndexing(maxBlockNum);
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
  await coreSDK.waitForGraphNodeIndexing(maxBlockNum);
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
    schemaUrl: "schema-url.com",
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
  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
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
  await args.buyerCoreSDK.waitForGraphNodeIndexing(commitToOfferTxReceipt);
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
  const response = await client.request<{
    _meta?: { block?: { number?: number } };
  }>(gql`
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

export function mockProductV1Metadata(
  template: string,
  productUuid: string = buildUuid(),
  overrides: DeepPartial<productV1.ProductV1Metadata> = {} as DeepPartial<productV1.ProductV1Metadata>
): productV1.ProductV1Metadata {
  const productV1ValidMinimalOfferClone = JSON.parse(
    JSON.stringify(productV1ValidMinimalOffer)
  );
  const productItem = mockProductV1Item(template, productUuid, {
    ...overrides,
    type: MetadataType.ITEM_PRODUCT_V1
  });
  return {
    ...productV1ValidMinimalOfferClone,
    ...overrides,
    ...productItem,
    uuid: buildUuid(),
    type: MetadataType.PRODUCT_V1
  } as productV1.ProductV1Metadata;
}

export function mockProductV1Item(
  template?: string,
  productUuid: string = buildUuid(),
  overrides: DeepPartial<productV1Item.ProductV1Item> = {} as DeepPartial<productV1Item.ProductV1Item>
): productV1Item.ProductV1Item {
  const productV1ValidMinimalOfferClone = JSON.parse(
    JSON.stringify(productV1ValidMinimalOffer)
  );
  return {
    schemaUrl: "schemaUrl",
    ...overrides,
    type: MetadataType.ITEM_PRODUCT_V1,
    uuid: buildUuid(),
    product: {
      ...productV1ValidMinimalOfferClone.product,
      ...overrides.product,
      uuid: productUuid
    },
    productOverrides: {
      ...overrides.productOverrides
    },
    variations: overrides.variations,
    shipping: {
      ...productV1ValidMinimalOfferClone.shipping,
      ...overrides.shipping
    },
    exchangePolicy: {
      ...productV1ValidMinimalOfferClone.exchangePolicy,
      ...overrides.exchangePolicy,
      template:
        template ?? productV1ValidMinimalOfferClone.exchangePolicy.template
    }
  } as productV1Item.ProductV1Item;
}

export async function createOfferArgs(
  coreSDK: CoreSDK,
  metadata: AnyMetadata,
  offerParams?: Partial<CreateOfferArgs>
): Promise<CreateOfferArgs> {
  const metadataHash = await coreSDK.storeMetadata(metadata);
  const metadataUri = "ipfs://" + metadataHash;

  const offerArgs = mockCreateOfferArgs({
    metadataHash,
    metadataUri,
    ...offerParams
  });

  return offerArgs;
}

export function resolveDateValidity(offerArgs: CreateOfferArgs) {
  offerArgs.validFromDateInMS = BigNumber.from(offerArgs.validFromDateInMS)
    .add(10000) // to avoid offerData validation error
    .toNumber();
  offerArgs.voucherRedeemableFromDateInMS = BigNumber.from(
    offerArgs.voucherRedeemableFromDateInMS
  )
    .add(10000) // to avoid offerData validation error
    .toNumber();
}

export async function prepareMultiVariantOffers(
  coreSDK: CoreSDK,
  variations: productV1.ProductV1Variant[],
  offersParams?: Array<Partial<CreateOfferArgs>>
) {
  const productUuid = buildUuid();
  const productMetadata = mockProductV1Metadata("a template", productUuid);

  const metadatas = productV1.createVariantProductMetadata(
    productMetadata,
    variations.map((variation) => {
      return { productVariant: variation };
    })
  );

  const offersArgs = await Promise.all(
    metadatas.map((metadata, index) =>
      createOfferArgs(coreSDK, metadata, offersParams?.[index])
    )
  );
  offersArgs.map((offerArgs) => resolveDateValidity(offerArgs));

  return {
    offerArgs: offersArgs,
    productMetadata,
    productUuid,
    variations
  };
}

export async function createOfferBatch(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  offersArgs: Array<CreateOfferArgs>
) {
  const sellers = await ensureCreatedSeller(sellerWallet);
  const [seller] = sellers;
  for (const offerArgs of offersArgs) {
    // Check the disputeResolver exists and is active
    const disputeResolverId = offerArgs.disputeResolverId;

    const dr = await coreSDK.getDisputeResolverById(disputeResolverId);
    expect(dr).toBeTruthy();
    expect(dr.active).toBe(true);
    expect(
      dr.sellerAllowList.length == 0 ||
        dr.sellerAllowList.indexOf(seller.id) >= 0
    ).toBe(true);
  }
  const createOfferTxResponse = await coreSDK.createOfferBatch(offersArgs);
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferIds = coreSDK.getCreatedOfferIdsFromLogs(
    createOfferTxReceipt.logs
  );

  expect(createdOfferIds.length).toEqual(offersArgs.length);

  await coreSDK.waitForGraphNodeIndexing(createOfferTxReceipt);
  const offerPromises = createdOfferIds.map((createdOfferId) =>
    coreSDK.getOfferById(createdOfferId as string)
  );
  const offers = await Promise.all(offerPromises);

  // Be sure the returned offers are in the same order as the offersArgs
  // (here we know that the metadataHash is unique for every offer)
  const retOffers: subgraph.OfferFieldsFragment[] = [];
  const offersMap = new Map<string, subgraph.OfferFieldsFragment>();
  for (const offer of offers) {
    offersMap.set(offer.metadataHash, offer);
  }
  for (const offersArg of offersArgs) {
    const offer = offersMap.get(offersArg.metadataHash);
    if (offer) {
      retOffers.push(offer);
    }
  }

  return retOffers;
}

export function mockNFTItem(
  overrides?: Partial<nftItem.NftItem>
): nftItem.NftItem {
  return {
    schemaUrl: "https://json-schema.org",
    type: MetadataType.ITEM_NFT,
    name: "Boson NFT Wearable",
    ...overrides
  };
}

export function mockBundleMetadata(
  itemUrls: string[],
  bundleUuid: string = buildUuid(),
  overrides?: Partial<Omit<bundle.BundleMetadata, "type" | "bundleUuid">>
): bundle.BundleMetadata {
  return {
    ...bundleMetadataMinimal,
    bundleUuid,
    type: MetadataType.BUNDLE,
    items: itemUrls.map((itemUrl) => {
      return { url: itemUrl };
    }),
    ...overrides
  };
}

export async function createBundleOffer(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  items: AnyMetadata[],
  bundleUuid?: string
): Promise<subgraph.OfferFieldsFragment> {
  const [offer] = await createBundleOffers(
    coreSDK,
    sellerWallet,
    [items],
    bundleUuid
  );
  return offer;
}

export async function createBundleOffers(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  itemsSets: AnyMetadata[][],
  bundleUuid?: string // When set, the same bundleUuid will be assigned to every bundle (used for a multi-variant product)
): Promise<subgraph.OfferFieldsFragment[]> {
  const offerArgsSets = await Promise.all(
    itemsSets.map(async (items) => {
      const itemUrls = await Promise.all(
        items.map(async (itemMetadata) => {
          const hash = await coreSDK.storeMetadata(itemMetadata);
          return `ipfs://${hash}`;
        })
      );
      const bundleMetadata = mockBundleMetadata(itemUrls, bundleUuid);
      const offerArgs = await createOfferArgs(coreSDK, bundleMetadata);
      resolveDateValidity(offerArgs);
      return offerArgs;
    })
  );

  if (offerArgsSets.length === 1) {
    return [await createOffer2(coreSDK, sellerWallet, offerArgsSets[0])];
  }
  return createOfferBatch(coreSDK, sellerWallet, offerArgsSets);
}

export async function createBundleMultiVariantOffers(
  coreSDK: CoreSDK,
  sellerWallet: Wallet,
  productUuid: string,
  variations: productV1.ProductV1Variant[],
  bundleUuid: string = buildUuid()
): Promise<subgraph.OfferFieldsFragment[]> {
  const productV1Items = variations.map((variation) =>
    mockProductV1Item(undefined, productUuid, {
      variations: variation
    })
  );
  const digitalItem = mockNFTItem();
  return createBundleOffers(
    coreSDK,
    sellerWallet,
    productV1Items.map((productV1Item) => [productV1Item, digitalItem]),
    bundleUuid // set the same bundleUuid means all bundle refer to the same multi-variant product
  );
}

export function serializeVariant(variant: productV1.ProductV1Variant): string {
  // Be sure each variation structure has its keys ordered
  const orderedStruct = variant.map((variation) =>
    Object.keys(variation)
      .sort()
      .reduce((obj, key) => {
        obj[key] = variation[key];
        return obj;
      }, {})
  ) as productV1.ProductV1Variant;
  // Be sure each variation in the table is ordered per type
  const orderedTable = orderedStruct.sort((a, b) =>
    a.type.localeCompare(b.type)
  );
  return JSON.stringify(orderedTable).toLowerCase();
}

export function createOpenseaSdk(privateKey: string): OpenSeaSDK {
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const walletV6: WalletV6 = new WalletV6(privateKey, providerV6);
  const OPENSEA_API_KEY = ""; // local mock doesn't need any
  const openseaUrl = "http://localhost:3334";
  const openseaSdk = new OpenSeaSDK(
    walletV6 as any,
    {
      chain: "hardhat" as Chain, // force cast
      apiKey: OPENSEA_API_KEY,
      apiBaseUrl: openseaUrl
    },
    (line) => console.info(`SEPOLIA OS: ${line}`)
  );
  (openseaSdk.api as any).apiBaseUrl = openseaUrl; // << force the API URL to allow using local mock
  // Force the seaport contract
  openseaSdk.seaport_v1_6 = new Seaport(walletV6 as any, {
    overrides: {
      seaportVersion: "1.6",
      contractAddress: defaultConfig.contracts.seaport || MOCK_SEAPORT_ADDRESS
    }
  });
  return openseaSdk;
}

export async function approveIfNeeded(
  operator: string,
  nftContract: string,
  coreSDK: CoreSDK
) {
  const isApprovedForAll = await coreSDK.isApprovedForAll(operator, {
    contractAddress: nftContract
  });
  if (!isApprovedForAll) {
    const approveTx = await coreSDK.approveProtocolForAll({
      operator: operator
    });
    await approveTx.wait();
  }
}
