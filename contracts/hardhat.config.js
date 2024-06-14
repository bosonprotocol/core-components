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
const { deployWrappersTask } = require("./scripts/tasks/deployWrappers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-wrappers", "Deploy wrappers", async (taskArgs, hre) => {
  const { chainId } = await hre.ethers.provider.getNetwork();
  const {
    protocolAddress,
    priceDiscoveryClient: unwrapperAddress,
    seaport
  } = getWrapperConfig(chainId);
  const { openSeaWrapperFactory } = await deployWrappersTask(
    hre,
    protocolAddress,
    unwrapperAddress,
    seaport
  );
  console.log(
    `✅ OpenSeaWrapperFactory Contract has been deployed at ${await openSeaWrapperFactory.getAddress()}`
  );
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
  const otherContracts_path = path.join(
    config.paths.root,
    "other-contracts",
    "**",
    "*.sol"
  );
  const otherContracts = await glob(otherContracts_path.replace(/\\/g, "/")); // Windows support
  return [...contracts, ...submodulesContracts, ...otherContracts].map(
    path.normalize
  );
});

const accountsFromEnv = process.env.DEPLOYER_PK
  ? [process.env.DEPLOYER_PK]
  : [];
console.log("HARDHAAAAAAT!", ACCOUNTS);
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.17" // Mock weth contract
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50, // temporary until we upgrade compiler version
            details: {
              yul: true
            }
          },
          outputSelection: {
            "*": {
              "*": ["evm.bytecode.object", "evm.deployedBytecode*"]
            }
          }
        },
        viaIR: true
      },
      {
        version: "0.8.22",
        settings: {
          viaIR: false,
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true
            }
          },
          evmVersion: "london" // for ethereum mainnet, use shanghai, for polygon, use london
        }
      },
      {
        version: "0.8.24", // required for seaport 1.6
        settings: {
          evmVersion: "cancun"
        }
      },
      {
        version: "0.8.17",
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
    amoy: {
      allowUnlimitedContractSize: true,
      chainId: 80002,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_AMOY || ""
    },
    sepolia: {
      allowUnlimitedContractSize: true,
      chainId: 11155111,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_SEPOLIA || ""
    },
    mainnet: {
      allowUnlimitedContractSize: true,
      chainId: 1,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_MAINNET || ""
    },
    polygon: {
      allowUnlimitedContractSize: true,
      chainId: 137,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL_POLYGON || ""
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
      "MockForwarder",
      "IBosonConfigHandler",
      "IBosonPriceDiscoveryHandler",
      "Seaport",
      "OpenSeaWrapper",
      "OpenSeaWrapperFactory"
    ]
  }
};

function getWrapperConfig(chainId) {
  switch (chainId) {
    case 1: {
      // Ethereum mainnet
      if (process.env.ENV_NAME !== "production") {
        throw new Error(
          `Environment variable ENV_NAME should be 'production' (current value '${process.env.ENV_NAME}')`
        );
      }
      return {
        protocolAddress: "0x59A4C19b55193D5a2EAD0065c54af4d516E18Cb5",
        priceDiscoveryClient: "0xb60cf39Fb18e5111174f346d0f39521ef6531fD4",
        seaport: "0x0000000000000068F116a894984e2DB1123eB395"
      };
    }
    case 137: {
      // Polygon
      if (process.env.ENV_NAME !== "production") {
        throw new Error(
          `Environment variable ENV_NAME should be 'production' (current value '${process.env.ENV_NAME}')`
        );
      }
      return {
        protocolAddress: "0x59A4C19b55193D5a2EAD0065c54af4d516E18Cb5",
        priceDiscoveryClient: "0xb60cf39Fb18e5111174f346d0f39521ef6531fD4",
        seaport: "0x0000000000000068F116a894984e2DB1123eB395"
      };
    }
    case 11155111: {
      let protocolAddress, priceDiscoveryClient;
      // Sepolia
      if (process.env.ENV_NAME === "testing") {
        protocolAddress = "0x7de418a7ce94debd057c34ebac232e7027634ade";
        priceDiscoveryClient = "0x789d8727b9ae0A8546489232EB55b6fBE86b21Ac";
      } else if (process.env.ENV_NAME === "staging") {
        protocolAddress = "0x26f643746cbc918b46c2d47edca68c4a6c98ebe6";
        priceDiscoveryClient = "0x9F3dAAA2D7B39C7ad4f375e095357012296e69B8";
      } else {
        throw new Error(
          `Environment variable ENV_NAME should be 'testing' or 'staging' (current value '${process.env.ENV_NAME}')`
        );
      }
      return {
        protocolAddress,
        priceDiscoveryClient,
        seaport: "0x0000000000000068F116a894984e2DB1123eB395"
      };
    }
    case 80002: {
      let protocolAddress, priceDiscoveryClient;
      // Amoy
      if (process.env.ENV_NAME === "testing") {
        protocolAddress = "0x7de418a7ce94debd057c34ebac232e7027634ade";
        priceDiscoveryClient = "0xFFcd4c407B60B0d4351945484F9354d2C9E34EA1";
      } else if (process.env.ENV_NAME === "staging") {
        protocolAddress = "0x26f643746cbc918b46c2d47edca68c4a6c98ebe6";
        priceDiscoveryClient = "0xbDD129B5034a65bd1F2872Df3F62C6dE1308352E";
      } else {
        throw new Error(
          `Environment variable ENV_NAME should be 'testing' or 'staging' (current value '${process.env.ENV_NAME}')`
        );
      }
      return {
        protocolAddress,
        priceDiscoveryClient,
        seaport: "0x0000000000000068F116a894984e2DB1123eB395"
      };
    }
    case 31337: {
      // Local
      if (process.env.ENV_NAME !== "local") {
        throw new Error(
          `Environment variable ENV_NAME should be 'local' (current value '${process.env.ENV_NAME}')`
        );
      }
      return {
        protocolAddress: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        priceDiscoveryClient: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        seaport: "0x0E801D84Fa97b50751Dbf25036d067dCf18858bF"
      };
    }
  }
}
