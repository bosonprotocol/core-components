/* eslint @typescript-eslint/no-var-requires: "off" */
const { task, subtask } = require("hardhat/config");
const { ACCOUNTS } = require("./accounts");
const dotEnvConfig = require("dotenv");
dotEnvConfig.config();

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");
const path = require("node:path");
const { glob } = require("glob");
const {
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS
} = require("hardhat/builtin-tasks/task-names");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Allow to merge different sources folder in hardhat config
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, async (_, { config }) => {
  const contracts_path = path.join(
    config.paths.root,
    "protocol-contracts",
    "contracts",
    "**",
    "*.sol"
  );
  const contracts = await glob(contracts_path.replace(/\\/g, "/")); // Windows support
  const seaportSubmodule_path = path.join(
    config.paths.root,
    "protocol-contracts",
    "submodules",
    "seaport"
  );
  const submodulesContracts = await glob(
    [
      path
        .join(seaportSubmodule_path, "contracts", "*.sol")
        .replace(/\\/g, "/"), // Windows support
      path
        .join(seaportSubmodule_path, "contracts", "conduit", "*.sol")
        .replace(/\\/g, "/") // Windows support
    ],
    {
      ignore: [
        path
          .join(seaportSubmodule_path, "node_modules", "**")
          .replace(/\\/g, "/"), // Windows support
        path
          .join(seaportSubmodule_path, "contracts", "test", "**")
          .replace(/\\/g, "/"), // Windows support
        path
          .join(seaportSubmodule_path, "contracts", "interfaces", "**")
          .replace(/\\/g, "/") // Windows support
      ]
    }
  );
  console.log("Add submodulesContracts:", submodulesContracts);
  return [...contracts, ...submodulesContracts].map(path.normalize);
});

const accountsFromEnv = process.env.DEPLOYER_PK
  ? [process.env.DEPLOYER_PK]
  : [];

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true
            }
          }
        }
      },
      {
        version: "0.8.17"
      },
      {
        version: "0.4.17"
      }
    ]
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 31337,
      accounts: ACCOUNTS.map(({ privateKey }) => ({
        privateKey,
        balance: "1000000000000000000000000000"
      })),
      mining: {
        auto: true,
        interval: 5000
      }
    },
    localhost: {
      allowUnlimitedContractSize: true,
      chainId: 31337,
      accounts: ACCOUNTS.map(({ privateKey }) => privateKey)
    },
    boson: {
      allowUnlimitedContractSize: true,
      chainId: 1234,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_BOSON || ""
    },
    ropsten: {
      allowUnlimitedContractSize: true,
      chainId: 3,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_ROPSTEN || ""
    },
    kovan: {
      allowUnlimitedContractSize: true,
      chainId: 42,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_KOVAN || ""
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  paths: {
    sources: "./protocol-contracts/contracts"
  },
  abiExporter: {
    path: "../packages/common/src/abis",
    flat: true,
    // only export supported ABIs in core-components
    only: [
      "ProtocolDiamond",
      "IBosonAccountHandler",
      "IBosonExchangeHandler",
      "IBosonFundsHandler",
      "IBosonOfferHandler",
      "IBosonOrchestrationHandler",
      "IBosonMetaTransactionsHandler",
      "IBosonDisputeHandler",
      "IBosonVoucher",
      "MockNativeMetaTransaction",
      "IBosonGroupHandler",
      "MockForwarder"
    ]
  }
};
