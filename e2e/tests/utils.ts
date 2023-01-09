import {
  ConditionStruct,
  CreateSellerArgs,
  TransactionResponse
} from "@bosonprotocol/common";
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
  getDefaultConfig,
  accounts
} from "../../packages/core-sdk/src";
import { IpfsMetadataStorage } from "../../packages/ipfs-storage/src";
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
  ACCOUNT_12
} from "../../contracts/accounts";
import {
  MOCK_ERC1155_ABI,
  MOCK_ERC20_ABI,
  MOCK_ERC721_ABI,
  MOCK_NFT_AUTH_721_ABI
} from "./mockAbis";
import { BaseMetadata } from "@bosonprotocol/metadata/src/base";
import { SellerFieldsFragment } from "../../packages/core-sdk/src/subgraph";
import { ZERO_ADDRESS } from "../../packages/core-sdk/tests/mocks";

export const MOCK_ERC20_ADDRESS =
  getDefaultConfig("local").contracts.testErc20 ||
  "0x998abeb3E57409262aE5b751f60747921B33613E";

export const MOCK_ERC721_ADDRESS =
  getDefaultConfig("local").contracts.testErc721 ||
  "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";

export const MOCK_ERC1155_ADDRESS =
  getDefaultConfig("local").contracts.testErc1155 ||
  "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";

export const metadata = {
  name: "name",
  description: "description",
  externalUrl: "external-url.com",
  animationUrl: "animation-url.com",
  licenseUrl: "license-url.com",
  schemaUrl: "schema-url.com"
};
export const sellerFundsDepositInEth = "5";

export const defaultConfig = getDefaultConfig("local");

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
// seedWallets used by native-meta-tx test
export const seedWallet12 = new Wallet(ACCOUNT_12.privateKey, provider);
// seedWallets used by productV1 test
export const seedWallet10 = new Wallet(ACCOUNT_10.privateKey, provider);

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
  const defaultConfig = getDefaultConfig(envName);
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
    web3Lib: new EthersAdapter(provider, wallet),
    metadataStorage: ipfsMetadataStorage,
    theGraphStorage: graphMetadataStorage,
    metaTx: {
      apiKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      apiIds
    }
  });
}

export async function waitForGraphNodeIndexing() {
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

  if (!sellers.length) {
    const tx = await sellerCoreSDK.createSeller({
      operator: sellerAddress,
      treasury: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      // TODO: replace with correct uri
      contractUri: "ipfs://seller-contract",
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0
    });
    await tx.wait();
    await waitForGraphNodeIndexing();
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
  disputeResolverToCreate: accounts.CreateDisputeResolverArgs,
  options: Partial<{
    activate: boolean;
  }> = {}
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

  if (options.activate && disputeResolverId) {
    await (
      await protocolAdminCoreSDK.activateDisputeResolver(disputeResolverId)
    ).wait();
  }

  await waitForGraphNodeIndexing();

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

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createOfferWithCondition(
  coreSDK: CoreSDK,
  condition: ConditionStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<BaseMetadata>;
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

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createSellerAndOfferWithCondition(
  coreSDK: CoreSDK,
  sellerAddress: string,
  condition: ConditionStruct,
  overrides: {
    offerParams?: Partial<CreateOfferArgs>;
    metadata?: Partial<BaseMetadata>;
  } = {}
) {
  const metadataHash = await coreSDK.storeMetadata({
    ...metadata,
    type: "BASE",
    ...overrides.metadata
  });
  const metadataUri = "ipfs://" + metadataHash;

  const createOfferTxResponse = await coreSDK.createSellerAndOfferWithCondition(
    {
      operator: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      treasury: sellerAddress,
      contractUri: metadataUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0
    },
    mockCreateOfferArgs({
      metadataHash,
      metadataUri,
      ...overrides.offerParams
    }),
    condition
  );
  const createOfferTxReceipt = await createOfferTxResponse.wait();
  const createdOfferId = coreSDK.getCreatedOfferIdFromLogs(
    createOfferTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function createSeller(
  coreSDK: CoreSDK,
  sellerAddress: string,
  sellerParams?: Partial<CreateSellerArgs>
) {
  const contractUri = "ipfs://0123456789abcdef";
  const createSellerTxResponse = await coreSDK.createSeller({
    operator: sellerAddress,
    admin: sellerAddress,
    clerk: sellerAddress,
    treasury: sellerAddress,
    contractUri,
    royaltyPercentage: "0",
    authTokenId: "0",
    authTokenType: 0,
    ...sellerParams
  });
  const createSellerTxReceipt = await createSellerTxResponse.wait();
  const createdSellerId = coreSDK.getCreatedSellerIdFromLogs(
    createSellerTxReceipt.logs
  );

  await waitForGraphNodeIndexing();
  const seller = await coreSDK.getSellerById(createdSellerId as string);

  return seller;
}

export async function updateSeller(
  coreSDK: CoreSDK,
  seller: SellerFieldsFragment,
  sellerParams: Partial<CreateSellerArgs>,
  optInSequence: {
    coreSDK: CoreSDK;
    fieldsToUpdate: {
      operator?: boolean;
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
  await Promise.all(optInTxs.map((tx) => tx.wait()));
  await waitForGraphNodeIndexing();
  const updatedSeller = await coreSDK.getSellerById(seller.id as string);
  return updatedSeller;
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

  const createOfferTxResponse = await coreSDK.createSellerAndOffer(
    {
      operator: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      treasury: sellerAddress,
      contractUri: metadataUri,
      royaltyPercentage: "0",
      authTokenId: "0",
      authTokenType: 0
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

  await waitForGraphNodeIndexing();
  const offer = await coreSDK.getOfferById(createdOfferId as string);

  return offer;
}

export async function mintLensToken(
  wallet: Wallet,
  to: string
): Promise<BigNumberish> {
  const defaultConfig = getDefaultConfig("local");
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
  tx.wait();

  return tokenId;
}
