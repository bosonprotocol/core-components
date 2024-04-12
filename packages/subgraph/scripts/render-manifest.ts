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
    "testing-80002-0": {
      network: "polygon-amoy",
      startBlock: 5608358 // amoy, block number when protocol was deployed https://www.oklink.com/amoy/tx/0x4c5fa4ecdaef460d53e14302b4acc99a51379f13c1c435e4d7faca6e09bf6ab0
    },
    "testing-11155111-0": {
      network: "sepolia",
      startBlock: 5583820 // sepolia, block number when protocol was deployed https://sepolia.etherscan.io/tx/0xef725682e82611d0f4b39707a2f3fa869fbfbbd10d85a4f0eb0ae6dddac59d40
    }
  },
  staging: {
    "staging-80002-0": {
      network: "polygon-amoy",
      startBlock: 5646249 // amoy, block number when protocol was deployed https://www.oklink.com/amoy/tx/0xecce702cd69df29088b3a69e24feb62787bda7d9fcf7f0694ccd22d29e98c326
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
