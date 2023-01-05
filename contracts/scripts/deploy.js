const gasLimit = "20000000";
process.env.CONFIRMATIONS = 1; // required for deployProtocolConfigFacet()
process.env.DEPLOYER_GAS_LIMIT_TEST = gasLimit;
process.env.AUTH_TOKEN_OWNERS_LOCAL = "";
process.env.TIP_MULTIPLIER = "10";
process.env.ADMIN_ADDRESS_LOCAL = "0x5131738127d2E5Edc999b1634342833667eBC8Bc"; // any non-zero address
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
  const { addresses } = await deployAndMintMockNFTAuthTokens();
  process.env.LENS_ADDRESS = addresses[0];
  process.env.ENS_ADDRESS = addresses[1];
  await deploySuite("localhost", undefined);
  const mockTokens = ["Foreign20", "Foreign721", "Foreign1155"];
  const deployedTokens = await deployMockTokens([...mockTokens]);
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
