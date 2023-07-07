import fs from "fs";
import { buildYup } from "schema-to-yup";
import { SchemaOf } from "yup";

import { EnvironmentType } from "@bosonprotocol/common/src/types/configs";
import { providers } from "ethers";
import { program } from "commander";
import { getDefaultConfig } from "@bosonprotocol/common/src";
import { CoreSDK } from "../packages/core-sdk/src";
import { EthersAdapter } from "../packages/ethers-sdk/src";

program
  .description("Check Exchange policy of an Offer.")
  .option("-e, --env <ENV_NAME>", "Target environment", "testing")
  .parse(process.argv);

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "http://example.com/person.schema.json",
  title: "Person",
  description: "A person",
  type: "object",
  properties: {
    disputePeriodDuration: {
      description: "disputePeriodDuration",
      type: "number",
      max: 3600 * 24 * 30 // 30 days to sec
    }
  }
};

const baseSchema: SchemaOf<any> = buildYup(schema, {});

async function main() {
  //   const [sellerPrivateKey] = program.args;
  const offerId = "10";

  const opts = program.opts();
  const envName = opts.env || "testing";
  const defaultConfig = getDefaultConfig(envName as EnvironmentType);
  const chainId = defaultConfig.chainId;
//   const sellerWallet = new Wallet(sellerPrivateKey);

  const coreSDK = CoreSDK.fromDefaultConfig({
    web3Lib: new EthersAdapter(
      new providers.JsonRpcProvider(defaultConfig.jsonRpcUrl)
    ),
    envName
  });

  const offerData = await coreSDK.getOfferById(offerId);
  console.log("offerData", offerData);

  const result = baseSchema.validateSync(offerData);
  console.log("result", result);
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
