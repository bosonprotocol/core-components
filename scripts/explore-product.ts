import fs from "fs";
import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { BigNumber, providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { CoreSDK, subgraph } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Explore a Product.")
  .argument("<PRODUCT_UUID>", "UUID of the Product")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .option("--export <FILEPATH>", "Export products offers data to a JSON file")
  .parse(process.argv);

async function main() {
  const [productUuid] = program.args;

  const opts = program.opts();
  const envName = opts.env || "testing";
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);

  console.log(`Explore Product with Id ${productUuid}`);
  console.log("defaultConfig", defaultConfig);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName
  });
  const product = await coreSDK.getProductWithVariants(productUuid);
  console.log(product);

  if (opts.export) {
    exportProductData(opts.export, product);
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

function exportProductData(
  filePath: string,
  product: {
    product: subgraph.BaseProductV1ProductFieldsFragment;
    variants: Array<{
      offer: subgraph.OfferFieldsFragment;
      variations: Array<subgraph.ProductV1Variation>;
    }>;
  } | null
) {
  console.log("Export product data to", filePath);
  const productData = product?.variants.map((v) => {
    return {
      metadataHash: v.offer.metadataHash,
      metadataUri: v.offer.metadataUri,
      exchangeToken: swapToken(v.offer.exchangeToken.address),
      price: BigNumber.from(v.offer.price).div(100).toString(),
      buyerCancelPenalty: BigNumber.from(v.offer.buyerCancelPenalty)
        .div(100)
        .toString()
    };
  });
  fs.writeFileSync(filePath, JSON.stringify(productData, undefined, 2));
}

function swapToken(exchangeToken: string) {
  switch (exchangeToken.toLowerCase()) {
    case "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619".toLowerCase(): // WETH POLYGON
      return "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"; // WETH MUMBAI
    case "0x9B3B0703D392321AD24338Ff1f846650437A43C9".toLowerCase(): // BOSON POLYGON
      return "0x1f5431E8679630790E8EbA3a9b41d1BB4d41aeD0"; // BOSON MUMBAI
    case "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174".toLowerCase(): // USDC POLYGON
      return "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747"; // USDC MUMBAI
    case "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063".toLowerCase(): // DAI POLYGON
      return "0x001b3b4d0f3714ca98ba10f6042daebf0b1b7b6f"; // DAI MUMBAI
    case "0xc2132D05D31c914a87C6611C10748AEb04B58e8F".toLowerCase(): // USDT POLYGON
      return "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832"; // USDT MUMBAI
  }
  return exchangeToken;
}
