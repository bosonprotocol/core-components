import { EnvironmentType } from "./../../common/src/types/configs";
import fs from "fs";
import handlebars from "handlebars";
import { providers } from "ethers";
import { getDefaultConfig } from "../../common/src/configs";

const generatedManifestsDir = __dirname + "/../generated/manifests";

const envName = process.argv[2];
const { contracts, chainId } = getDefaultConfig(envName as EnvironmentType);

const envNameToConfig: Record<
  string,
  {
    network: string;
    startBlock: number;
  }
> = {
  local: {
    network: "localhost",
    startBlock: 0
  },
  testing: {
    network: "mumbai",
    startBlock: 28496901 // mumbai, NOT block num when protocol is deployed (manual override)
  },
  staging: {
    network: "mumbai",
    startBlock: 27771547 // mumbai, block num when protocol is deployed
  },
  production: {
    network: "mumbai", // TODO: change to "providers.getNetwork(chainId).name" after protocol deploy
    startBlock: 27771547 // TODO: swap out for protocol deploy block
  }
};
const { network, startBlock } = envNameToConfig[envName] || {
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
