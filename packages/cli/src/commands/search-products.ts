import { Command } from "commander";
import { buildReadOnlyCoreSDK, getEnvName, getConfigId } from "../utils";

export const searchProductsCommand = new Command("search-products")
  .description(
    "Search for products by keywords in the Boson Protocol metadata."
  )
  .argument(
    "<keywords>",
    "Comma-separated list of keywords to search for in product metadata. " +
      "Can also be set via SEARCH_KEYWORDS env var."
  )
  .option(
    "-e, --env <envName>",
    "Target environment (testing|staging|production). Overrides ENV_NAME env var.",
    "testing"
  )
  .option(
    "-c, --configId <configId>",
    "Config id. Overrides ENV_CONFIG_ID env var.",
    "testing-80002-0"
  )
  .action(async (keywordsArg: string, opts) => {
    const envName = getEnvName(opts);
    const configId = getConfigId(opts);
    const resolvedKeywordsArg =
      keywordsArg || process.env.SEARCH_KEYWORDS || "";

    const keywords = resolvedKeywordsArg
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    if (keywords.length === 0) {
      console.error("No keywords provided.");
      process.exit(1);
    }

    const coreSDK = buildReadOnlyCoreSDK(envName, configId);
    const result = await coreSDK.searchProducts(keywords);
    console.log(`Found ${result.length} products:`);
    result.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
    });
  });
