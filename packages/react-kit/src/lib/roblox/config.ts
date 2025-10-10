export type ConfigId =
  | "local-31337-0"
  | "testing-80002-0"
  | "testing-11155111-0"
  | "staging-80002-0"
  | "staging-11155111-0"
  | "production-137-0"
  | "production-1-0";

export type EnvironmentType = "local" | "testing" | "staging" | "production";

type Config = {
  envName: EnvironmentType;
  configId: ConfigId;
  chainId: number;
  backendOrigin: string;
};

export const envConfigs: Record<EnvironmentType, Config[]> = {
  local: [
    {
      envName: "local",
      chainId: 31337,
      configId: "local-31337-0",
      backendOrigin: "http://localhost:3336",
    },
  ],
  testing: [
    {
      envName: "testing",
      chainId: 80002,
      configId: "testing-80002-0",
      backendOrigin: "https://roblox-backend-783540427620.europe-west2.run.app",
    },
    {
      envName: "testing",
      chainId: 11155111,
      configId: "testing-11155111-0",
      backendOrigin: "http://localhost:3336", // TODO: change
    },
  ],
  staging: [
    {
      envName: "staging",
      chainId: 80002,
      configId: "staging-80002-0",
      backendOrigin: "http://localhost:3336", // TODO: change
    },
    {
      envName: "staging",
      chainId: 11155111,
      configId: "staging-11155111-0",
      backendOrigin: "http://localhost:3336", // TODO: change
    },
  ],
  production: [
    {
      envName: "production",
      chainId: 137,
      configId: "production-137-0",
      backendOrigin: "http://localhost:3336", // TODO: change
    },
    {
      envName: "production",
      chainId: 1,
      configId: "production-1-0",
      backendOrigin: "http://localhost:3336", // TODO: change
    },
  ],
};
