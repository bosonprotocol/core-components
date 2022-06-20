import { providers, Wallet, utils } from "ethers";
import { CoreSDK, getDefaultConfig } from "../../packages/core-sdk/src";
import { IpfsMetadataStorage } from "../../packages/ipfs-storage/src";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { ACCOUNT_1, ACCOUNT_2 } from "../../contracts/accounts";

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
  const coreSDK = CoreSDK.fromDefaultConfig({
    envName: "local",
    web3Lib: new EthersAdapter(provider, fundedWallet),
    metadataStorage: ipfsMetadataStorage,
    theGraphStorage: graphMetadataStorage
  });
  return { coreSDK, fundedWallet };
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
  const fundedWallet = Wallet.createRandom({
    provider: fundingWallet.provider
  });
  const fundingTx = await fundingWallet.sendTransaction({
    value: utils.parseEther(fundAmountInEth),
    to: fundedWallet.address
  });
  await fundingTx.wait();

  return fundedWallet;
}
