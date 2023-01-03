const gasLimit = "20000000";
process.env.CONFIRMATIONS = 1; // required for deployProtocolConfigFacet()
process.env.DEPLOYER_GAS_LIMIT_TEST = gasLimit;
process.env.AUTH_TOKEN_OWNERS_LOCAL = "";
process.env.TIP_MULTIPLIER = "10";
require("dotenv").config({
  path: "./protocol-contracts/.env"
});
/* eslint @typescript-eslint/no-var-requires: "off" */

const {
  deploySuite
} = require("../protocol-contracts/scripts/deploy-suite.js");

const {
  deployAndMintMockNFTAuthTokens,
  deployMockTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens.js");

async function main() {
  await deploySuite("localhost", undefined);
  await deployAndMintMockNFTAuthTokens();
  const mockTokens = ["Foreign20", "Foreign721", "Foreign1155"];
  const deployedTokens = await deployMockTokens(mockTokens);
  console.log(`✅ Mock tokens deployed: ${deployedTokens.length}`);
  for (const [index, mockToken] of Object.entries(mockTokens)) {
    console.log(
      `✅ Mock token ${mockToken} has been deployed at ${deployedTokens[index].address}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
