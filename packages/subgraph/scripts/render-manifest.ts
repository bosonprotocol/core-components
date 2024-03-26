import { EnvironmentType, ConfigId } from "./../../common/src/types/configs";
import fs from "fs";
import handlebars from "handlebars";
import { providers } from "ethers";
import { getEnvConfigById } from "../../common/src/configs";

const generatedManifestsDir = __dirname + "/../generated/manifests";

const envName = process.argv[2];
const configId = process.argv[3];
const { contracts, chainId } = getEnvConfigById(
  envName as EnvironmentType,
  configId as ConfigId
);

const envNameToConfig: Record<
  EnvironmentType,
  Partial<
    Record<
      ConfigId,
      {
        network: string;
        startBlock: number;
      }
    >
  >
> = {
  local: {
    "local-31337-0": {
      network: "localhost",
      startBlock: 0
    }
  },
  testing: {
    "testing-80001-0": {
      network: "mumbai",
      startBlock: 35370695 // mumbai, this is NOT the block number when the protocol was deployed (manual override as there was an error in the subgraph)
    },
    "testing-80002-0": {
      network: "amoy", // TO BE CONFIRMED
      startBlock: 4958511 // TODO: change it
    },
    "testing-5-0": {
      network: "goerli",
      startBlock: 9757131 // goerli, block number when protocol was deployed https://goerli.etherscan.io/tx/0x3c51e116a6a1849936e6bd45fcee78017259ce86a93601e5e7c77cbdc25b6f38
    },
    "testing-11155111-0": {
      network: "sepolia",
      startBlock: 5517165 // sepolia, block number when protocol was deployed https://sepolia.etherscan.io/tx/0x755c74e6c8717d4385d65b22ddf46b885030cd4289ed072a58d26efeab1b77c1
    }
  },
  staging: {
    "staging-80001-0": {
      network: "mumbai",
      startBlock: 28566747 // mumbai, block number when protocol was deployed
    },
    "staging-80002-0": {
      network: "amoy", // TO BE CONFIRMED
      startBlock: 4958511 // TODO: change it
    },
    "staging-5-0": {
      network: "goerli",
      startBlock: 9756834 // goerli, block number when protocol was deployed https://goerli.etherscan.io/tx/0x7d4b731fc8b9fe77999f46a52891f2bd13651666bb9a15d7044b33bddd52b355
    },
    "staging-11155111-0": {
      network: "sepolia",
      startBlock: 5519001 // TODO: change it
    }
  },
  production: {
    "production-137-0": {
      network: providers.getNetwork(chainId).name,
      startBlock: 34258150 // polygon, block num when protocol is deployed
    },
    "production-1-0": {
      network: "mainnet",
      startBlock: 18240548 // ethereum, block num when protocol is deployed
    }
  }
};
const { network, startBlock } = envNameToConfig[envName][configId] || {
  network: "",
  startBlock: 0
};

const manifestTemplate = fs.readFileSync(
  __dirname + "/../subgraph.template.yaml"
);
const template = handlebars.compile(String(manifestTemplate));
const manifest = template({
  protocolDiamond: contracts.protocolDiamond,
  network,
  startBlock
});

if (!fs.existsSync(generatedManifestsDir)) {
  fs.mkdirSync(generatedManifestsDir, { recursive: true });
}

fs.writeFileSync(generatedManifestsDir + `/subgraph.${envName}.yaml`, manifest);
fs.writeFileSync(__dirname + "/../subgraph.yaml", manifest);
