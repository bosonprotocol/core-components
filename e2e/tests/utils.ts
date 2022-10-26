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

export const MOCK_ERC20_ADDRESS =
  getDefaultConfig("local").contracts.testErc20 ||
  "0x998abeb3E57409262aE5b751f60747921B33613E";

export const MOCK_ERC721_ADDRESS =
  getDefaultConfig("local").contracts.testErc721 ||
  "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";

export const MOCK_ERC1155_ADDRESS =
  getDefaultConfig("local").contracts.testErc1155 ||
  "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";

export const MOCK_ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_holder",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const MOCK_ERC721_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x01ffc9a7"
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x06fdde03"
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "getApproved",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x081812fc"
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x095ea7b3"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x18160ddd"
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address"
      },
      {
        name: "to",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x23b872dd"
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "index",
        type: "uint256"
      }
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x2f745c59"
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address"
      },
      {
        name: "to",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x42842e0e"
  },
  {
    constant: true,
    inputs: [
      {
        name: "index",
        type: "uint256"
      }
    ],
    name: "tokenByIndex",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x4f6ccce7"
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ownerOf",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x6352211e"
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x70a08231"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x95d89b41"
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address"
      },
      {
        name: "approved",
        type: "bool"
      }
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xa22cb465"
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address"
      },
      {
        name: "to",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      },
      {
        name: "_data",
        type: "bytes"
      }
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xb88d4fde"
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "tokenURI",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xc87b56dd"
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address"
      },
      {
        name: "operator",
        type: "address"
      }
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xe985e9c5"
  },
  {
    inputs: [
      {
        name: "name",
        type: "string"
      },
      {
        name: "symbol",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
    signature: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event",
    signature:
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event",
    signature:
      "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        name: "operator",
        type: "address"
      },
      {
        indexed: false,
        name: "approved",
        type: "bool"
      }
    ],
    name: "ApprovalForAll",
    type: "event",
    signature:
      "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31"
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address"
      },
      {
        name: "tokenId",
        type: "uint256"
      },
      {
        name: "tokenURI",
        type: "string"
      }
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xd3fc9864"
  }
];

export const metadata = {
  name: "name",
  description: "description",
  externalUrl: "external-url.com",
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
// roberto
export async function ensureMintedERC721AndAllowedTokens(
  wallets: Wallet[],
  tokenId: BigNumberish,
  approve = true
) {
  // Mint tokens
  const mintTxResponses = await Promise.all(
    wallets.map((wallet) => {
      return mockErc721Contract
        .connect(wallet)
        .mint(wallet.address, tokenId, "sample/url");
    })
  );

  await Promise.all(mintTxResponses.map((txResponse) => txResponse.wait()));

  if (approve) {
    // Allow tokens
    const allowTxResponses = await Promise.all(
      wallets.map((wallet) =>
        initCoreSDKWithWallet(wallet).approveExchangeToken(
          MOCK_ERC721_ADDRESS,
          tokenId
        )
      )
    );
    await Promise.all(allowTxResponses.map((txResponse) => txResponse.wait()));
  }
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
