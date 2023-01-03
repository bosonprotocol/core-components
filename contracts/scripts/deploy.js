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
  deployAndMintMockNFTAuthTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens.js");

async function main() {
  await deploySuite("localhost", undefined); // TODO: verify
  await deployAndMintMockNFTAuthTokens();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
