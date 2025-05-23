import { EnvironmentType, ConfigId } from "./../../common/src/types/configs";
import fs from "fs";
import handlebars from "handlebars";
import { getEnvConfigById } from "../../common/src/configs";

const generatedManifestsDir = __dirname + "/../generated/manifests";

const envName = process.argv[2];
const configId = process.argv[3];
const { contracts } = getEnvConfigById(
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
    },
    "testing-84532-0": {
      network: "base-sepolia",
      startBlock: 20927614 // base-sepolia, block number when protocol was deployed https://sepolia.basescan.org/tx/0x06749f2d579176f4a825869906d5db9e5c700829331de9a46bbb6d0eeb8b930e
    },
    "testing-11155420-0": {
      network: "optimism-sepolia",
      startBlock: 24332651 // optimism-sepolia, block number when protocol was deployed https://sepolia-optimistic.etherscan.io/tx/0x108f6ba0c2fd48c5e1528e0019ad3a15d827536520b55371861f31ce28502feb
    },
    "testing-421614-0": {
      network: "arbitrum-sepolia",
      startBlock: 135766377 // arbitrum-sepolia, block number when protocol was deployed https://sepolia.arbiscan.io/tx/0xd756e7a5148d970ba72d866bf21302653e0df047ea8676650e5dc4ca4e695b78
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
    },
    "staging-84532-0": {
      network: "base-sepolia",
      startBlock: 20927855 // base-sepolia, block number when protocol was deployed https://sepolia.basescan.org/tx/0x492d19d9a86fcf697f3a7c94b961714006ff224895cfee4fb1a7bc7afe2ab65f
    },
    "staging-11155420-0": {
      network: "optimism-sepolia",
      startBlock: 24332809 // optimism-sepolia, block number when protocol was deployed https://sepolia-optimistic.etherscan.io/tx/0x4ace3e8576828d688645378a73b96c4a05f7ad6f01b02b64a5f13675db8adccd
    },
    "staging-421614-0": {
      network: "arbitrum-sepolia",
      startBlock: 135768486 // arbitrum-sepolia, block number when protocol was deployed https://sepolia.arbiscan.io/tx/0xbf40aa41d85682ecfb64fa940910c2bd826c032af587b077028fd639437aef83
    }
  },
  production: {
    "production-137-0": {
      network: "polygon",
      startBlock: 34258150 // polygon, block num when protocol is deployed
    },
    "production-1-0": {
      network: "mainnet",
      startBlock: 18240548 // ethereum, block num when protocol is deployed
    },
    "production-8453-0": {
      network: "base",
      startBlock: 25765296 // block number when protocol was deployed https://basescan.org/tx/0x7b1052fe88862c519561110e34f8a502c43a71df198520eabe135417585499ca
    },
    "production-10-0": {
      network: "optimism",
      startBlock: 133002790 // block number when protocol was deployed https://optimistic.etherscan.io/tx/0x9950ab98822ab6579495dd39ba38bf044a3d5a8d869d41f36ce2802b4a42d631
    },
    "production-42161-0": {
      network: "arbitrum-one",
      startBlock: 321778899 // block number when protocol was deployed https://arbiscan.io/tx/0x4619b9fabf674886ccefa8f220e7802701d3db90165ac3677973992cd42b721c
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
