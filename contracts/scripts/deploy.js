const gasLimit = "20000000";
process.env.CONFIRMATIONS = 1; // required for deployProtocolConfigFacet()
process.env.DEPLOYER_GAS_LIMIT_TEST = gasLimit;
process.env.AUTH_TOKEN_OWNERS_LOCAL = "";
process.env.TIP_MULTIPLIER = "10";
/* eslint @typescript-eslint/no-var-requires: "off" */
const hre = require("hardhat");
const ethers = hre.ethers;

const protocolConfig = require("../protocol-contracts/scripts/config/protocol-parameters");
const authTokenAddresses = require("../protocol-contracts/scripts/config/auth-token-addresses");

const Role = require("../protocol-contracts/scripts/domain/Role");
const {
  deployProtocolDiamond
} = require("../protocol-contracts/scripts/util/deploy-protocol-diamond.js");
const {
  deployProtocolClients
} = require("../protocol-contracts/scripts/util/deploy-protocol-clients.js");
const {
  deployProtocolConfigFacet
} = require("../protocol-contracts/scripts/util/deploy-protocol-config-facet.js");
const {
  deployProtocolHandlerFacets
} = require("../protocol-contracts/scripts/util/deploy-protocol-handler-facets.js");
const {
  deploymentComplete
} = require("../protocol-contracts/scripts/util/utils");
const {
  deployMockTokens,
  deployAndMintMockNFTAuthTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens");
const { oneMonth } = require("../protocol-contracts/test/util/constants");
const AuthTokenType = require("../protocol-contracts/scripts/domain/AuthTokenType");

function getConfig(network) {
  return [
    {
      token: protocolConfig.TOKEN[network],
      treasury: protocolConfig.TREASURY[network],
      voucherBeacon: protocolConfig.BEACON[network],
      beaconProxy: protocolConfig.BEACON_PROXY[network]
    },
    {
      ...protocolConfig.limits,
      minDisputePeriod: "1"
    },
    protocolConfig.fees
  ];
}

/**
 * Get the contract addresses for supported NFT Auth token contracts
 * @returns {lensAddress: string, ensAddress: string}
 */
function getAuthTokenContracts(network) {
  if (network === "localhost") {
    return {
      lensAddress: "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3",
      ensAddress: "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0"
    };
  }
  return {
    lensAddress: authTokenAddresses.LENS[network],
    ensAddress: authTokenAddresses.ENS[network]
  };
}

/**
 * Get a list of no-arg initializer facet names to be cut into the Diamond
 */
function getNoArgFacetNames() {
  return [
    "AccountHandlerFacet",
    "SellerHandlerFacet",
    "BuyerHandlerFacet",
    "DisputeResolverHandlerFacet",
    "AgentHandlerFacet",
    "BundleHandlerFacet",
    "DisputeHandlerFacet",
    "ExchangeHandlerFacet",
    "FundsHandlerFacet",
    "GroupHandlerFacet",
    "MetaTransactionsHandlerFacet",
    "OfferHandlerFacet",
    "OrchestrationHandlerFacet",
    "TwinHandlerFacet",
    "PauseHandlerFacet"
  ];
}

async function main() {
  console.log("compile");
  // Compile everything (in case run by node)
  await hre.run("compile");

  // Deployed contracts
  let contracts = [];

  // Output script header
  const divider = "-".repeat(80);
  console.log(
    `${divider}\nBoson Protocol V2 Contract Suite Deployer\n${divider}`
  );
  console.log(`⛓  Network: ${hre.network.name}\n📅 ${new Date()}`);

  // Get the protocol config
  const config = getConfig(hre.network.name);
  const authTokenContracts = getAuthTokenContracts(hre.network.name);

  // Get the accounts
  const accounts = await ethers.getSigners();
  const deployerSigner = accounts[0];
  const deployer = deployerSigner.address;
  const disputeResolverSigner = accounts[1];
  const disputeResolver = disputeResolverSigner.address;
  console.log(
    "🔱 Deployer account: ",
    deployer ? deployer : "not found" && process.exit()
  );
  console.log(divider);

  if (hre.network.name === "localhost" || !config[0].token) {
    console.log(`\n💎 Deploying mock tokens...`);
    const [mockBosonToken] = await deployMockTokens(gasLimit);
    deploymentComplete("BosonToken", mockBosonToken.address, [], "", contracts);
    config[0].token = mockBosonToken.address;
  }

  console.log(
    `\n💎 Deploying AccessController, ProtocolDiamond, and Diamond utility facets...`
  );

  // Deploy the Diamond
  const [protocolDiamond, dlf, dcf, erc165f, accessController, diamondArgs] =
    await deployProtocolDiamond(gasLimit);
  deploymentComplete(
    "AccessController",
    accessController.address,
    [],
    "",
    contracts
  );
  deploymentComplete("DiamondLoupeFacet", dlf.address, [], "", contracts);
  deploymentComplete("DiamondCutFacet", dcf.address, [], "", contracts);
  deploymentComplete("ERC165Facet", erc165f.address, [], "", contracts);
  deploymentComplete(
    "ProtocolDiamond",
    protocolDiamond.address,
    diamondArgs,
    "",
    contracts
  );

  console.log(`\n💎 Deploying and initializing protocol facets...`);

  // Temporarily grant UPGRADER role to deployer account
  await accessController.grantRole(Role.UPGRADER, deployer);

  const {
    facets: [configHandlerFacet]
  } = await deployProtocolConfigFacet(protocolDiamond, config, gasLimit);
  deploymentComplete(
    "ConfigHandlerFacet",
    configHandlerFacet.address,
    [],
    "",
    contracts
  );

  // Deploy and cut facets
  const deployedFacets = await deployProtocolHandlerFacets(
    protocolDiamond,
    getNoArgFacetNames(),
    gasLimit
  );
  for (let i = 0; i < deployedFacets.length; i++) {
    const deployedFacet = deployedFacets[i];
    deploymentComplete(
      deployedFacet.name,
      deployedFacet.contract.address,
      [],
      "",
      contracts
    );
  }

  console.log(`\n⧉ Deploying Protocol Client implementation/proxy pairs...`);

  // Deploy the Protocol Client implementation/proxy pairs
  const protocolClientArgs = [protocolDiamond.address];
  const [impls, beacons, proxies] = await deployProtocolClients(
    protocolClientArgs,
    gasLimit
  );
  const [bosonVoucherImpl] = impls;
  const [bosonClientBeacon] = beacons;
  const [bosonVoucherProxy] = proxies;

  // Gather the complete args that were used to create the proxies
  const bosonVoucherProxyArgs = [
    ...protocolClientArgs,
    bosonVoucherImpl.address
  ];

  // Report and prepare for verification
  deploymentComplete(
    "BosonVoucher Logic",
    bosonVoucherImpl.address,
    [],
    "",
    contracts
  );
  deploymentComplete(
    "BosonVoucher Beacon",
    bosonClientBeacon.address,
    [],
    "",
    contracts
  );
  deploymentComplete(
    "BosonVoucher Proxy",
    bosonVoucherProxy.address,
    bosonVoucherProxyArgs,
    "",
    contracts
  );

  console.log(`\n🌐️Configuring and granting roles...`);

  // Cast Diamond to the IBosonConfigHandler interface for further interaction with it
  const bosonConfigHandler = await ethers.getContractAt(
    "IBosonConfigHandler",
    protocolDiamond.address
  );

  // Add Voucher NFT addresses to protocol config
  await bosonConfigHandler.setVoucherBeaconAddress(bosonClientBeacon.address);
  await bosonConfigHandler.setBeaconProxyAddress(bosonVoucherProxy.address);

  //Add NFT auth token addresses to protocol config
  await bosonConfigHandler.setAuthTokenContract(
    AuthTokenType.Lens,
    authTokenContracts.lensAddress
  );
  await bosonConfigHandler.setAuthTokenContract(
    AuthTokenType.ENS,
    authTokenContracts.ensAddress
  );

  console.log(
    `✅ ConfigHandlerFacet updated with remaining post-initialization config.`
  );

  // Add roles to contracts and addresses that need it
  // Renounce temporarily granted UPGRADER role for deployer account
  await accessController.renounceRole(Role.UPGRADER, deployer);
  await accessController.grantRole(Role.PROTOCOL, protocolDiamond.address);

  console.log(`✅ Granted roles to appropriate contract and addresses.`);

  // Some custom stuff for e2e setup
  if (["localhost", "hardhat"].includes(hre.network.name)) {
    console.log(`\n🌐️Custom stuff for e2e setup...`);

    // Deploy ERC20-compliant mock token for testing
    const [foreign20Token, foreign721Token, foreign1155Token] =
      await deployMockTokens(gasLimit, [
        "Foreign20",
        "Foreign721",
        "Foreign1155"
      ]);
    deploymentComplete("Foreign20", foreign20Token.address, [], "", contracts);
    deploymentComplete(
      "Foreign721",
      foreign721Token.address,
      [],
      "",
      contracts
    );
    deploymentComplete(
      "Foreign1155",
      foreign1155Token.address,
      [],
      "",
      contracts
    );

    await deployAndMintMockNFTAuthTokens();

    // Create and activate default dispute resolver
    const accountHandler = await ethers.getContractAt(
      "IBosonAccountHandler",
      protocolDiamond.address
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
            tokenAddress: foreign20Token.address,
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
    await accountHandler.activateDisputeResolver(disputeResolverId);
    console.log(`✅ Dispute resolver activated`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
