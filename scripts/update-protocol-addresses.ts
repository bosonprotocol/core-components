/**
 * to be called with npx ts-node -P tsconfig.base.json ./scripts/update-protocol-addresses.ts
 */

import fs from "fs";
import { resolve } from "path";
import { program } from "commander";
import { ProtocolAddressesConfig } from "../packages/common/src";

program.description("Update the protocol addresses.").parse(process.argv);

type EnvConfig = {
  chains: string[];
  suffix: string;
};

type ProtocolConfig = {
  chainId: string;
  env: string;
  protocolVersion: string;
  contracts: {
    name: string;
    address: string;
    args: unknown[];
  }[];
  externalAddresses?: {
    // Only on Fermion
    bosonProtocolAddress: string;
    bosonPriceDiscoveryAddress: string;
    bosonTokenAddress: string;
    wrappedNativeAddress: string;
    seaportConfig: {
      seaport: string;
      openSeaConduit: string;
      openSeaConduitKey: string;
    };
  };
};

const CONFIGS: Record<
  "testing" | "staging" | "production",
  EnvConfig | undefined
> = {
  testing: {
    chains: [
      "80002-amoy",
      "11155111-sepolia",
      "84532-basesepolia",
      "11155420-optimismsepolia",
      "421614-arbitrum-sepolia"
    ],
    suffix: "test"
  },
  staging: {
    chains: [
      "80002-amoy",
      "11155111-sepolia",
      "84532-basesepolia",
      "11155420-optimismsepolia",
      "421614-arbitrum-sepolia"
    ],
    suffix: "staging"
  },
  production: {
    chains: [
      "1-mainnet",
      "137-polygon",
      "8453-base",
      "10-optimism",
      "42161-arbitrum"
    ],
    suffix: "prod"
  }
};

const PROTOCOL_ADDRESSES_DIR = resolve(
  __dirname,
  "../contracts/protocol-contracts/addresses"
);

function readProtocolFile(fileName): ProtocolConfig | undefined {
  try {
    const protocolFile = fs
      .readFileSync(resolve(PROTOCOL_ADDRESSES_DIR, fileName))
      .toString();
    return JSON.parse(protocolFile) as ProtocolConfig;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

async function main() {
  // - use a regexp to extract the JSON definition of envConfigs
  const protocolAddressesFile = resolve(
    __dirname,
    "../packages/common/src/generated/protocolAddresses.json"
  );
  const rawProtocolAddressesFile = fs
    .readFileSync(protocolAddressesFile)
    .toString();
  const protocolAddresses = JSON.parse(
    rawProtocolAddressesFile
  ) as ProtocolAddressesConfig;

  for (const envName of ["testing", "staging", "production"]) {
    const envConfig: EnvConfig = CONFIGS[envName];
    for (const chain of envConfig.chains) {
      const protocolConfig = readProtocolFile(
        `${chain}-${envConfig.suffix}.json`
      );
      if (protocolConfig) {
        if (!protocolAddresses[envName]) {
          protocolAddresses[envName] = {};
        }
        protocolAddresses[envName][Number(protocolConfig.chainId)] = {
          protocolDiamond: protocolConfig.contracts.find(
            (contracts) => contracts.name === "ProtocolDiamond"
          )?.address,
          priceDiscoveryClient: protocolConfig.contracts.find(
            (contracts) => contracts.name === "BosonPriceDiscoveryClient"
          )?.address
        };
      }
    }
  }

  fs.writeFileSync(
    protocolAddressesFile,
    JSON.stringify(protocolAddresses, undefined, 2)
  );
}

main()
  .then(() => console.log("success"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
