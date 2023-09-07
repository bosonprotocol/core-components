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
    "testing-5-0": {
      network: "goerli",
      startBlock: 9618015 // goerli, block number when protocol was deployed https://goerli.etherscan.io/address/0xDA01E28EA66B4294EeE21013bC45a0114E976Da4
    }
  },
  staging: {
    "staging-80001-0": {
      network: "mumbai",
      startBlock: 28566747 // mumbai, block number when protocol was deployed
    }
  },
  production: {
    "production-137-0": {
      network: providers.getNetwork(chainId).name,
      startBlock: 34258150 // polygon, block num when protocol is deployed
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
