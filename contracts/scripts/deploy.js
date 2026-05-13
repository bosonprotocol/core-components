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
const { deploySeaport } = require("./deploy-seaport");
const { ZeroAddress } = require("ethers");
const { deployWrappers } = require("./deploy-wrappers.js");
const { deployDRFeeMutualizer } = require("./deploy-dRFeeMutualizer.js");
const {
  deployWeth,
  deployERC2612Token,
  deployERC3009Token,
  deployPermit2
} = require("./deploy-other-tokens.js");

async function main() {
  const { addresses } = await deployAndMintMockNFTAuthTokens();
  process.env.LENS_ADDRESS = addresses[0];
  process.env.ENS_ADDRESS = addresses[1];
  const MockForwarder = await ethers.getContractFactory("MockForwarder");
  const forwarder = await MockForwarder.deploy();
  process.env.FORWARDER_ADDRESS = await forwarder.getAddress();
  console.log(
    "deployed forwarder",
    "process.env.FORWARDER_ADDRESS",
    process.env.FORWARDER_ADDRESS
  );
  await deploySuite("localhost", undefined);
  const mockTokens = ["Foreign20", "Foreign721", "Foreign1155"];
  const deployedTokens = await deployMockTokens([...mockTokens]);
  const erc20sForDisputeResolver = new Map();
  for (const [index, mockToken] of Object.entries(mockTokens)) {
    console.log(
      `✅ Mock token ${mockToken} has been deployed at ${await deployedTokens[
        index
      ].getAddress()}`
    );
    if (mockToken === "Foreign20") {
      erc20sForDisputeResolver.set(
        mockToken,
        await deployedTokens[index].getAddress()
      );
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
  const priceDiscoveryClient = deployedContracts.find(
    (c) => c.name === "BosonPriceDiscoveryClient"
  )?.address;

  // Deploy Seaport contract
  const mockSeaport = await deploySeaport();
  const seaportAddress = await mockSeaport.getAddress();
  console.log(`✅ Seaport Contract has been deployed at ${seaportAddress}`);
  // Deploy wrappers contracts
  const { openSeaWrapperFactory } = await deployWrappers(
    protocolDiamond,
    priceDiscoveryClient,
    seaportAddress
  );
  console.log(
    `✅ OpenSeaWrapperFactory Contract has been deployed at ${await openSeaWrapperFactory.getAddress()}`
  );

  // Deploy WETH contract
  const weth = await deployWeth();
  const wethAddress = await weth.getAddress();
  console.log(`✅ WETH Contract has been deployed at ${wethAddress}`);
  process.env.WETH_ADDRESS = wethAddress;
  // Deploy DRFeeMutualizer
  const dRFeeMutualizer = await deployDRFeeMutualizer(
    protocolDiamond,
    process.env.FORWARDER_ADDRESS,
    wethAddress
  );
  const dRFeeMutualizerAddress = await dRFeeMutualizer.getAddress();
  console.log(
    `✅ DRFeeMutualizer Contract has been deployed at ${dRFeeMutualizerAddress}`
  );

  // Deploy MockERC3009Token contract
  const mockERC3009Token = await deployERC3009Token();
  const mockERC3009TokenAddress = await mockERC3009Token.getAddress();
  console.log(
    `✅ MockERC3009Token Contract has been deployed at ${mockERC3009TokenAddress}`
  );
  erc20sForDisputeResolver.set("MockERC3009Token", mockERC3009TokenAddress);

  // Deploy MockERC2612Token contract
  const mockERC2612Token = await deployERC2612Token();
  const mockERC2612TokenAddress = await mockERC2612Token.getAddress();
  console.log(
    `✅ MockERC2612Token Contract has been deployed at ${mockERC2612TokenAddress}`
  );
  erc20sForDisputeResolver.set("MockERC2612Token", mockERC2612TokenAddress);

  // Deploy MockPermit2 contract
  const mockPermit2 = await deployPermit2();
  const mockPermit2Address = await mockPermit2.getAddress();
  console.log(
    `✅ MockPermit2 Contract has been deployed at ${mockPermit2Address}`
  );
  erc20sForDisputeResolver.set("MockPermit2", mockPermit2Address);

  // Create default dispute resolver
  const accounts = await ethers.getSigners();
  const disputeResolverSigner = accounts[1];
  const disputeResolver = disputeResolverSigner.address;
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
        assistant: disputeResolver,
        admin: disputeResolver,
        clerk: ZeroAddress,
        treasury: disputeResolver,
        // TODO: use valid uri
        metadataUri: `ipfs://disputeResolver1`,
        active: true
      },
      [
        {
          tokenAddress: ZeroAddress,
          tokenName: "Native",
          feeAmount: "0"
        },
        ...Array.from(erc20sForDisputeResolver.entries()).map(
          ([tokenName, tokenAddress]) => ({
            tokenAddress,
            tokenName,
            feeAmount: "0"
          })
        )
      ],
      []
    );
  const receipt = await response.wait();
  const event = receipt.logs.find(
    (eventLog) => eventLog.eventName === "DisputeResolverCreated"
  );
  const disputeResolverId = event.args.disputeResolverId;
  console.log(
    `✅ Dispute resolver created. ID: ${disputeResolverId} Wallet: ${disputeResolver}`
  );

  // Set specific configuration values (needed for tests)
  const deployer = accounts[0];
  const configHandler = await ethers.getContractAt(
    "IBosonConfigHandler",
    protocolDiamond
  );
  const response2 = await configHandler
    .connect(deployer)
    .setMinResolutionPeriod("1");
  await response2.wait();
  console.log(`✅ Protocol has been configured`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
