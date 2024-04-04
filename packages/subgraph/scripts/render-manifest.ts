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
    "testing-11155111-0": {
      network: "sepolia",
      startBlock: 5583820 // sepolia, block number when protocol was deployed https://sepolia.etherscan.io/tx/0xef725682e82611d0f4b39707a2f3fa869fbfbbd10d85a4f0eb0ae6dddac59d40
    }
  },
  staging: {
    "staging-80001-0": {
      network: "mumbai",
      startBlock: 28566747 // mumbai, block number when protocol was deployed
    },
    "staging-11155111-0": {
      network: "sepolia",
      startBlock: 5612422 // sepolia, block number when protocol was deployed https://sepolia.etherscan.io/tx/0x2f2469e88a68433794e77fd5aba9629c9dad7c61f4b0bb45f2a57fc3e65ca1f1
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
