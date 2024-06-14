import { EnvironmentType, getEnvConfigById } from "@bosonprotocol/common";
import { program } from "commander";
import { providers, Wallet } from "ethers";
import {
  Wallet as WalletV6,
  JsonRpcProvider as JsonRpcProviderV6
} from "ethers-v6";
import { EthersAdapter } from "../../packages/ethers-sdk/src";
import { CoreSDK } from "../../packages/core-sdk/src";
import { MarketplaceType } from "../../packages/core-sdk/src/marketplaces/types";
import { approveIfNeeded, createOpenSeaSDK } from "./utils";

program
  .description("Create a Listing on Opensea (for Seller).")
  .argument(
    "<SELLER_PRIVATE_KEY>",
    "Private key of the Seller account (assistant role)."
  )
  .argument(
    "<TOKEN_IDS>",
    "Comma-separated list of tokenIds of the preminted voucher to be wrapped"
  )
  .option("-e, --env <ENV_NAME>", "Target environment")
  .option("-c, --configId <CONFIG_ID>", "Config id")
  .parse(process.argv);

async function main() {
  const [sellerPrivateKey, tokenIdsList] = program.args;
  const tokenIds = tokenIdsList.split(",");

  const opts = program.opts();
  const envName = opts.env || process.env.ENV_NAME || "testing";
  const configId =
    opts.configId || process.env.ENV_CONFIG_ID || "testing-80002-0";
  const defaultConfig = getEnvConfigById(envName as EnvironmentType, configId);
  const chainId = defaultConfig.chainId;
  const provider = new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl);
  const providerV6 = new JsonRpcProviderV6(defaultConfig.jsonRpcUrl);
  const sellerWallet = new Wallet(sellerPrivateKey);
  const sellerWalletV6: WalletV6 = new WalletV6(sellerPrivateKey, providerV6);
  const coreSDKSeller = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(provider, sellerWallet),
    envName,
    configId
  });

  const tokenIdsPerContract = new Map<string, string[]>();
  for (const tokenId of tokenIds) {
    const { offerId, exchangeId } = coreSDKSeller.parseTokenId(tokenId);
    console.log({
      offerId: offerId.toString(),
      exchangeId: exchangeId.toString()
    });
    const offer = await coreSDKSeller.getOfferById(offerId);
    const nftContract = offer.collection.collectionContract.address;
    if (!tokenIdsPerContract.has(nftContract.toLowerCase())) {
      tokenIdsPerContract.set(nftContract.toLowerCase(), []);
    }
    tokenIdsPerContract.get(nftContract.toLowerCase())?.push(tokenId);
  }
  const openseaSdkSeller = coreSDKSeller.marketplace(
    MarketplaceType.OPENSEA,
    // We need to create the OpenSeaSDK, even if it won't be used to wrap the vouchers
    createOpenSeaSDK(sellerWalletV6, chainId, "", defaultConfig),
    ""
  );
  for (const nftContract of tokenIdsPerContract.keys()) {
    const wrapper =
      await openseaSdkSeller.getOrCreateVouchersWrapper(nftContract);
    // Ensure the seller approve wrapper for all voucher tokens to allow wrapping
    await approveIfNeeded(wrapper.address, nftContract, coreSDKSeller);
    // Wrap vouchers
    const tokens = tokenIdsPerContract.get(nftContract);
    console.log(
      `Wrap tokens ${JSON.stringify(tokens)} for contract ${nftContract}`
    );
    const wrapTx = await openseaSdkSeller.wrapVouchers(
      nftContract,
      tokens || []
    );
    console.log(`Wrapping vouchers ${wrapTx.hash}...`);
    await wrapTx.wait();
    console.log(
      `Nft contract:${nftContract}, wrapper:${wrapper.address}, wrapped tokens:${tokenIdsPerContract.get(nftContract)}`
    );
  }
}

main()
  .then(() => {
    console.log("success");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
