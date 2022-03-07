import { ProtocolConfig } from "./types";

export const defaultConfigs: ProtocolConfig[] = [
  {
    envName: "local",
    chainId: 31337,
    subgraphUrl: "http://localhost:8000/subgraphs/name/dohaki/bosoncclocal",
    contracts: {
      protocolDiamond: "0xad7A37a28923a9534809eEdE6c783a1F22df1c2b"
    }
  },
  {
    envName: "testing",
    chainId: 3,
    subgraphUrl:
      "https://api.thegraph.com/subgraphs/name/dohaki/bosonccropsten",
    contracts: {
      protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5"
    }
  },
  {
    envName: "staging",
    chainId: 3,
    subgraphUrl: "",
    contracts: {
      protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5"
    }
  },
  {
    envName: "production",
    chainId: 1,
    subgraphUrl: "",
    contracts: {
      protocolDiamond: "0x5E3f5127e320aD0C38a21970E327eefEf12561E5"
    }
  }
];

export function getDefaultConfigByEnvName(envName: string): ProtocolConfig {
  const [defaultConfig] = defaultConfigs.filter(
    (config) => config.envName === envName.toLowerCase()
  );

  if (!defaultConfig) {
    throw new Error(`No default config found for env '${envName}'`);
  }

  return defaultConfig;
}
