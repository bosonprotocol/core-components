import * as dotenv from "dotenv";
// Load .env file from the current working directory before anything else
dotenv.config();

import path from "path";
import fs from "fs";
import { Command } from "commander";
import { createSellerCommand } from "./commands/create-seller";
import { updateSellerCommand } from "./commands/update-seller";
import { getSellerCommand } from "./commands/get-seller";
import { createOfferCommand } from "./commands/create-offer";
import { exploreOfferCommand } from "./commands/explore-offer";
import { depositFundsCommand } from "./commands/deposit-funds";
import { completeExchangeCommand } from "./commands/complete-exchange";
import { uploadToIpfsCommand } from "./commands/upload-to-ipfs";
import { searchProductsCommand } from "./commands/search-products";

// Read version from package.json at runtime so it always reflects the published version
const packageRoot = path.resolve(__dirname, "../../");
const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "package.json"), "utf-8")
);

const program = new Command();

program
  .name("boson")
  .description(
    "CLI for interacting with the Boson Protocol.\n\n" +
      "Common arguments can be passed as environment variables in a local .env file.\n" +
      "For example: ENV_NAME, ENV_CONFIG_ID, SELLER_PRIVATE_KEY, PRIVATE_KEY, etc.\n\n" +
      "Run `boson help <command>` for details on a specific command."
  )
  .version(packageJson.version);

program.addCommand(createSellerCommand);
program.addCommand(updateSellerCommand);
program.addCommand(getSellerCommand);
program.addCommand(createOfferCommand);
program.addCommand(exploreOfferCommand);
program.addCommand(depositFundsCommand);
program.addCommand(completeExchangeCommand);
program.addCommand(uploadToIpfsCommand);
program.addCommand(searchProductsCommand);

program.parseAsync(process.argv).catch((e) => {
  console.error(e);
  process.exit(1);
});
