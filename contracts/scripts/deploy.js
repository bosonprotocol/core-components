/* eslint @typescript-eslint/no-var-requires: "off" */
const hre = require("hardhat");
const ethers = hre.ethers;

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
} = require("../protocol-contracts/scripts/util/report-verify-deployments");
const {
  deployMockTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens");

function getConfig() {
  const feePercentage = "150"; // 1.5%  = 150
  const maxOffersPerGroup = "100";
  const maxTwinsPerBundle = "100";
  const maxOffersPerBundle = "100";
  const maxOffersPerBatch = "100";
  const maxTokensPerWithdrawal = "100";

  return {
    gasLimit: "20000000",
    treasuryAddress: ethers.constants.AddressZero,
    voucherAddress: ethers.constants.AddressZero,
    feePercentage,
    maxOffersPerGroup,
    maxTwinsPerBundle,
    maxOffersPerBundle,
    maxOffersPerBatch,
    maxTokensPerWithdrawal
  };
}

/**
 * Get a list of no-arg initializer facet names to be cut into the Diamond
 */
function getNoArgFacetNames() {
  return [
    "AccountHandlerFacet",
    "BundleHandlerFacet",
    "DisputeHandlerFacet",
    "ExchangeHandlerFacet",
    "FundsHandlerFacet",
    "GroupHandlerFacet",
    "MetaTransactionsHandlerFacet",
    "OfferHandlerFacet",
    "OrchestrationHandlerFacet",
    "TwinHandlerFacet"
  ];
}

async function main() {
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
  const config = getConfig();

  // Get the accounts
  const accounts = await ethers.provider.listAccounts();
  const deployer = accounts[0];
  console.log(
    "🔱 Deployer account: ",
    deployer ? deployer : "not found" && process.exit()
  );
  console.log(divider);

  console.log(`\n💎 Deploying mock tokens...`);
  const [mockBosonToken] = await deployMockTokens(config.gasLimit);
  deploymentComplete("BosonToken", mockBosonToken.address, [], contracts);

  console.log(
    `\n💎 Deploying AccessController, ProtocolDiamond, and Diamond utility facets...`
  );

  // Deploy the Diamond
  const [protocolDiamond, dlf, dcf, accessController, diamondArgs] =
    await deployProtocolDiamond(config.gasLimit);
  deploymentComplete(
    "AccessController",
    accessController.address,
    [],
    contracts
  );
  deploymentComplete("DiamondLoupeFacet", dlf.address, [], contracts);
  deploymentComplete("DiamondCutFacet", dcf.address, [], contracts);
  deploymentComplete(
    "ProtocolDiamond",
    protocolDiamond.address,
    diamondArgs,
    contracts
  );

  console.log(`\n💎 Deploying and initializing protocol facets...`);

  // Temporarily grant UPGRADER role to deployer account
  await accessController.grantRole(Role.UPGRADER, deployer);

  // Cut the ConfigHandlerFacet facet into the Diamond
  const protocolConfig = [
    mockBosonToken.address,
    config.treasuryAddress,
    config.voucherAddress,
    config.feePercentage,
    config.maxOffersPerGroup,
    config.maxTwinsPerBundle,
    config.maxOffersPerBundle,
    config.maxOffersPerBatch,
    config.maxTokensPerWithdrawal
  ];
  const {
    facets: [configHandlerFacet]
  } = await deployProtocolConfigFacet(
    protocolDiamond,
    protocolConfig,
    config.gasLimit
  );
  deploymentComplete(
    "ConfigHandlerFacet",
    configHandlerFacet.address,
    [],
    contracts
  );

  // Deploy and cut facets
  const deployedFacets = await deployProtocolHandlerFacets(
    protocolDiamond,
    getNoArgFacetNames(),
    config.gasLimit
  );
  for (let i = 0; i < deployedFacets.length; i++) {
    const deployedFacet = deployedFacets[i];
    deploymentComplete(
      deployedFacet.name,
      deployedFacet.contract.address,
      [],
      contracts
    );
  }

  console.log(`\n⧉ Deploying Protocol Client implementation/proxy pairs...`);

  // Deploy the Protocol Client implementation/proxy pairs
  const protocolClientArgs = [
    accessController.address,
    protocolDiamond.address
  ];
  const [impls, proxies, clients] = await deployProtocolClients(
    protocolClientArgs,
    config.gasLimit
  );
  const [bosonVoucherImpl] = impls;
  const [bosonVoucherProxy] = proxies;
  const [bosonVoucher] = clients;

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
    contracts
  );
  deploymentComplete(
    "BosonVoucher Proxy",
    bosonVoucherProxy.address,
    bosonVoucherProxyArgs,
    contracts
  );

  console.log(`\n🌐️Configuring and granting roles...`);

  // Cast Diamond to the IBosonConfigHandler interface for further interaction with it
  const bosonConfigHandler = await ethers.getContractAt(
    "IBosonConfigHandler",
    protocolDiamond.address
  );

  // Renounce temporarily granted UPGRADER role for deployer account
  await accessController.renounceRole(Role.UPGRADER, deployer);

  // Add Voucher NFT addresses to protocol config
  await bosonConfigHandler.setVoucherAddress(bosonVoucher.address);

  console.log(
    `✅ ConfigHandlerFacet updated with remaining post-initialization config.`
  );

  // Add roles to contracts and addresses that need it
  await accessController.grantRole(Role.PROTOCOL, protocolDiamond.address);
  await accessController.grantRole(Role.CLIENT, bosonVoucher.address);

  console.log(`✅ Granted roles to appropriate contract and addresses.`);

  // Some custom stuff for e2e setup
  console.log(`\n🌐️Custom stuff...`);

  const accountHandler = await ethers.getContractAt(
    "IBosonAccountHandler",
    protocolDiamond.address
  );
  await accountHandler.createDisputeResolver({
    id: "1",
    wallet: deployer,
    active: true
  });
  console.log(`✅ Dispute resolver deployed. \n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
