/* eslint @typescript-eslint/no-var-requires: "off" */
const { task } = require("hardhat/config");
const { ACCOUNTS } = require("./accounts");
require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("hardhat-abi-exporter");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const accountsFromEnv = process.env.DEPLOYER_PK
  ? [process.env.DEPLOYER_PK]
  : [];

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
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
      chainId: 31337,
      accounts: ACCOUNTS.map(({ privateKey }) => privateKey)
    },
    ropsten: {
      chainId: 3,
      accounts: accountsFromEnv,
      url: process.env.JSON_RPC_URL || ""
    }
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
      "IBosonOrchestrationHandler"
    ]
  }
};
