const gasLimit = "20000000";
process.env.CONFIRMATIONS = 1; // required for deployProtocolConfigFacet()
process.env.DEPLOYER_GAS_LIMIT_TEST = gasLimit;
process.env.AUTH_TOKEN_OWNERS_LOCAL = "";
process.env.TIP_MULTIPLIER = "10";
process.env.ADMIN_ADDRESS_LOCAL = "0x5131738127d2E5Edc999b1634342833667eBC8Bc"; // any non-zero address
require("dotenv").config({
  path: "./protocol-contracts/.env"
});
const hre = require("hardhat");
const ethers = hre.ethers;
const { oneMonth } = require("../protocol-contracts/test/util/constants");
const fs = require("fs").promises;
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
  const MockForwarder = await ethers.getContractFactory("MockForwarder");
  const forwarder = await MockForwarder.deploy();
  process.env.FORWARDER_ADDRESS = forwarder.address;
  console.log(
    "deployed forwarder",
    "process.env.FORWARDER_ADDRESS",
    process.env.FORWARDER_ADDRESS
  );
  await deploySuite("localhost", undefined);
  const mockTokens = ["Foreign20", "Foreign721", "Foreign1155"];
  const deployedTokens = await deployMockTokens([...mockTokens]);
  let foreign20Token;
  for (const [index, mockToken] of Object.entries(mockTokens)) {
    console.log(
      `✅ Mock token ${mockToken} has been deployed at ${deployedTokens[index].address}`
    );
    if (mockToken === "Foreign20") {
      foreign20Token = deployedTokens[index].address;
    }
  }
  const file = await fs.readFile(
    "./protocol-contracts/addresses/31337-localhost-localhost.json",
    "utf8"
  );
  const deployedContracts = JSON.parse(file.toString())["contracts"];
  const protocolDiamond = deployedContracts.find(
    (c) => c.name === "ProtocolDiamond"
  )?.address;
  const accounts = await ethers.getSigners();
  const disputeResolverSigner = accounts[1];
  const disputeResolver = disputeResolverSigner.address;
  // Create default dispute resolver
  const accountHandler = await ethers.getContractAt(
    "IBosonAccountHandler",
    protocolDiamond
  );
  const response = await accountHandler
    .connect(disputeResolverSigner)
    .createDisputeResolver(
      {
        id: "1",
        escalationResponsePeriod: oneMonth.toString(),
        operator: disputeResolver,
        admin: disputeResolver,
        clerk: disputeResolver,
        treasury: disputeResolver,
        // TODO: use valid uri
        metadataUri: `ipfs://disputeResolver1`,
        active: true
      },
      [
        {
          tokenAddress: ethers.constants.AddressZero,
          tokenName: "Native",
          feeAmount: "0"
        },
        {
          tokenAddress: foreign20Token,
          tokenName: "Foreign20",
          feeAmount: "0"
        }
      ],
      []
    );
  const receipt = await response.wait();
  const event = receipt.events.find(
    (event) => event.event === "DisputeResolverCreated"
  );
  const disputeResolverId = event.args.disputeResolverId;
  console.log(
    `✅ Dispute resolver created. ID: ${disputeResolverId} Wallet: ${disputeResolver}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
