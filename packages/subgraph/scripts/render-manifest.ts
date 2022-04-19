import fs from "fs";
import handlebars from "handlebars";
import { providers } from "ethers";
import { getDefaultConfig } from "../../common/src/configs";

const generatedManifestsDir = __dirname + "/../generated/manifests";

const envName = process.argv[2];
const { contracts, chainId } = getDefaultConfig({ envName });

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
    network: "mainnet",
    startBlock: 0
  },
  staging: {
    network: providers.getNetwork(chainId).name,
    startBlock: 12027000
  },
  production: {
    network: providers.getNetwork(chainId).name,
    startBlock: 12027000
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
