process.env.CONFIRMATIONS = 1; // required for deployProtocolConfigFacet()
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
  deploymentComplete,
  verifyOnEtherscan,
  delay
} = require("../protocol-contracts/scripts/util/report-verify-deployments");
const {
  deployMockTokens
} = require("../protocol-contracts/scripts/util/deploy-mock-tokens");
const { oneMonth } = require("../protocol-contracts/test/utils/constants");
const AuthTokenType = require("../protocol-contracts/scripts/domain/AuthTokenType");

const gasLimit = "20000000";

function getConfig() {
  const bosonTokenMap = {
    ropsten: "0xf47e4fd9d2ebd6182f597ee12e487cca37fc524c"
  };

  const feePercentage = "150"; // 1.5%  = 150
  const protocolFeeFlatBoson = "0";
  const maxExchangesPerBatch = "100";
  const maxOffersPerGroup = "100";
  const maxTwinsPerBundle = "100";
  const maxOffersPerBundle = "100";
  const maxOffersPerBatch = "100";
  const maxTokensPerWithdrawal = "100";
  const maxFeesPerDisputeResolver = 100;
  const maxEscalationResponsePeriod = oneMonth;
  const maxDisputesPerBatch = "100";
  const maxAllowedSellers = "100";
  const buyerEscalationDepositPercentage = "100"; // 1%
  const maxTotalOfferFeePercentage = 4000; // 40%
  const maxRoyaltyPecentage = 1000; //10%
  const maxResolutionPeriod = oneMonth;

  return [
    {
      token: bosonTokenMap[hre.network.name],
      treasury: ethers.constants.AddressZero,
      voucherBeacon: ethers.constants.AddressZero,
      beaconProxy: ethers.constants.AddressZero
    },
    {
      maxExchangesPerBatch,
      maxOffersPerGroup,
      maxTwinsPerBundle,
      maxOffersPerBundle,
      maxOffersPerBatch,
      maxTokensPerWithdrawal,
      maxFeesPerDisputeResolver,
      maxEscalationResponsePeriod,
      maxDisputesPerBatch,
      maxAllowedSellers,
      maxTotalOfferFeePercentage,
      maxRoyaltyPecentage,
      maxResolutionPeriod
    },
    {
      percentage: feePercentage,
      flatBoson: protocolFeeFlatBoson
    },
    buyerEscalationDepositPercentage
  ];
}

/**
 * Get the contract addresses for supported NFT Auth token contracts
 * @returns {lensAddress: string, ensAddress: string}
 */
function getAuthTokenContracts() {
  // Lens protocol NFT contract address
  const LENS = {
    mainnet: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
    hardhat: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
    test: "0x0000111122223333444455556666777788889999",
    localhost: "0x0000111122223333444455556666777788889999",
    mumbai: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"
  };

  // ENS contract address
  const ENS = {
    mainnet: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    hardhat: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
    test: "0x0000111122223333444455556666777788889999",
    localhost: "0x0000111122223333444455556666777788889999",
    mumbai: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
  };

  return {
    lensAddress: LENS[hre.network.name],
    ensAddress: ENS[hre.network.name]
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
  const authTokenContracts = getAuthTokenContracts();

  // Get the accounts
  const accounts = await ethers.provider.listAccounts();
  const deployer = accounts[0];
  const disputeResolver = accounts[1];
  console.log(
    "🔱 Deployer account: ",
    deployer ? deployer : "not found" && process.exit()
  );
  console.log(divider);

  if (hre.network.name === "localhost" || !config[0].token) {
    console.log(`\n💎 Deploying mock tokens...`);
    const [mockBosonToken] = await deployMockTokens(gasLimit);
    deploymentComplete("BosonToken", mockBosonToken.address, [], contracts);
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
    contracts
  );
  deploymentComplete("DiamondLoupeFacet", dlf.address, [], contracts);
  deploymentComplete("DiamondCutFacet", dcf.address, [], contracts);
  deploymentComplete("ERC165Facet", erc165f.address, [], contracts);
  deploymentComplete(
    "ProtocolDiamond",
    protocolDiamond.address,
    diamondArgs,
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
      contracts
    );
  }

  console.log(`\n⧉ Deploying Protocol Client implementation/proxy pairs...`);

  // Deploy the Protocol Client implementation/proxy pairs
  const protocolClientArgs = [
    accessController.address,
    protocolDiamond.address
  ];
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
    contracts
  );
  deploymentComplete(
    "BosonVoucher Beacon",
    bosonClientBeacon.address,
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
  await accessController.grantRole(Role.PROTOCOL, protocolDiamond.address);

  console.log(`✅ Granted roles to appropriate contract and addresses.`);

  // Some custom stuff for e2e setup
  if (["localhost", "hardhat"].includes(hre.network.name)) {
    console.log(`\n🌐️Custom stuff for e2e setup...`);

    // Deploy ERC20-compliant mock token for testing
    const [foreign20Token] = await deployMockTokens(gasLimit, ["Foreign20"]);
    deploymentComplete("Foreign20", foreign20Token.address, [], contracts);

    // Create and activate default dispute resolver
    const accountHandler = await ethers.getContractAt(
      "IBosonAccountHandler",
      protocolDiamond.address
    );
    const response = await accountHandler.createDisputeResolver(
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

    console.log("\n");
    process.exit();
  }

  // Wait a minute after deployment completes and then verify contracts on etherscan
  console.log(
    "\n⏲ Pause one minute, allowing deployments to propagate to Etherscan backend..."
  );
  await delay(60_000).then(async () => {
    console.log("🔍 Verifying contracts on Etherscan...");
    for (const contract of contracts) {
      await verifyOnEtherscan(contract);
    }
  });

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
