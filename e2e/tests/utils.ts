import {
  providers,
  Wallet,
  utils,
  Contract,
  BigNumber,
  BigNumberish
} from "ethers";
import { CoreSDK, getDefaultConfig } from "../../packages/core-sdk/src";
import { IpfsMetadataStorage } from "../../packages/ipfs-storage/src";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { ACCOUNT_1, ACCOUNT_2, ACCOUNT_3 } from "../../contracts/accounts";

export const MOCK_ERC20_ADDRESS =
  getDefaultConfig({ chainId: 31337 }).contracts.testErc20 ||
  "0x998abeb3E57409262aE5b751f60747921B33613E";

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

export const metadata = {
  name: "name",
  description: "description",
  externalUrl: "external-url.com",
  schemaUrl: "schema-url.com"
};
export const sellerFundsDepositInEth = "5";

export const defaultConfig = getDefaultConfig({
  envName: "local"
});

export const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
export const seedWallet1 = new Wallet(ACCOUNT_1.privateKey, provider);
export const seedWallet2 = new Wallet(ACCOUNT_2.privateKey, provider);
export const seedWallet3 = new Wallet(ACCOUNT_3.privateKey, provider);

export const mockErc20Contract = new Contract(
  MOCK_ERC20_ADDRESS,
  MOCK_ERC20_ABI,
  provider
);

export const ipfsMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.ipfsMetadataUrl
});
export const graphMetadataStorage = new IpfsMetadataStorage({
  url: defaultConfig.theGraphIpfsUrl
});

export async function initSellerAndBuyerSDKs(
  args: Partial<{
    seedWalletForSeller: Wallet;
    seedWalletForBuyer: Wallet;
  }> = {}
) {
  const [
    { coreSDK: sellerCoreSDK, fundedWallet: sellerWallet },
    { coreSDK: buyerCoreSDK, fundedWallet: buyerWallet }
  ] = await Promise.all([
    initCoreSDKWithFundedWallet(args.seedWalletForSeller || seedWallet1),
    initCoreSDKWithFundedWallet(args.seedWalletForSeller || seedWallet2)
  ]);

  return {
    sellerCoreSDK,
    buyerCoreSDK,
    sellerWallet,
    buyerWallet
  };
}

export async function initCoreSDKWithFundedWallet(
  seedWallet: Wallet = seedWallet1
) {
  const fundedWallet = await createFundedWallet(seedWallet || seedWallet1);
  const coreSDK = initCoreSDKWithWallet(fundedWallet);
  return { coreSDK, fundedWallet };
}

export function initCoreSDKWithWallet(wallet: Wallet) {
  return CoreSDK.fromDefaultConfig({
    envName: "local",
    web3Lib: new EthersAdapter(provider, wallet),
    metadataStorage: ipfsMetadataStorage,
    theGraphStorage: graphMetadataStorage
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

async function createFundedWallet(
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
  let seller = await sellerCoreSDK.getSellerByAddress(sellerAddress);

  if (!seller) {
    const tx = await sellerCoreSDK.createSeller({
      operator: sellerAddress,
      treasury: sellerAddress,
      admin: sellerAddress,
      clerk: sellerAddress,
      // TODO: replace with correct uri
      contractUri: "ipfs://seller-contract"
    });
    await tx.wait();
    await waitForGraphNodeIndexing();
    seller = await sellerCoreSDK.getSellerByAddress(sellerAddress);
  }

  return seller;
}

export async function ensureMintedAndAllowedTokens(
  wallets: Wallet[],
  mintAmountInEth: BigNumberish = 1_000_000
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

    // Allow tokens
    const allowTxResponses = await Promise.all(
      wallets.map((wallet) =>
        initCoreSDKWithWallet(wallet).approveExchangeToken(
          MOCK_ERC20_ADDRESS,
          mintAmountWei
        )
      )
    );
    await Promise.all(allowTxResponses.map((txResponse) => txResponse.wait()));
  }
}
