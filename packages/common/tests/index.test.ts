import { chains } from "../src/chains";
import {
  abis,
  getEnvConfigs,
  getEnvConfigById,
  envConfigs,
  EnvironmentType
} from "../src/index";
import { chainIdToDefaultTokens, chainIdToGraphTx } from "../src/mappings";

describe("index entrypoint", () => {
  test("export abis", () => {
    expect(abis.IBosonOfferHandlerABI).toBeTruthy();
    expect(abis.ProtocolDiamondABI).toBeTruthy();
  });

  test("export default configs", () => {
    expect(envConfigs).toBeTruthy();
    expect(getEnvConfigs).toBeTruthy();
    expect(getEnvConfigById).toBeTruthy();
  });

  test.each(["testing", "staging", "production"])(
    `check the number of available configs for %p env`,
    (envName) => {
      const envConfigs = getEnvConfigs(envName as EnvironmentType);
      const nbConfigs = {
        testing: 3,
        staging: 3,
        production: 3
      };
      expect(envConfigs).toBeTruthy();
      expect(envConfigs.length).toEqual(nbConfigs[envName]);
    }
  );

  test.each(["testing", "staging", "production"])(
    `check the available configs for %p env`,
    (envName) => {
      const envConfigs = getEnvConfigs(envName as EnvironmentType);
      envConfigs.forEach((envConfig) => {
        const config = getEnvConfigById(
          envName as EnvironmentType,
          envConfig.configId
        );
        expect(config).toBeTruthy();
      });
    }
  );

  test.each(["testing", "staging", "production"])(
    `check the graphTx is available in each configs for %p env`,
    (envName) => {
      const envConfigs = getEnvConfigs(envName as EnvironmentType);
      envConfigs.forEach((envConfig) => {
        const graphTx = chainIdToGraphTx.get(envConfig.chainId);
        expect(graphTx).toBeTruthy();
        expect(
          (graphTx as (txHash?: string, isAddress?: boolean) => string)()
        ).toBeTruthy();
        expect(
          (graphTx as (txHash?: string, isAddress?: boolean) => string)(
            "0xdba9c988759d705bff694acc038d7923bbdc0090bb15d06922c2239ad7197390",
            false
          )
        ).toBeTruthy();
        expect(
          (graphTx as (txHash?: string, isAddress?: boolean) => string)(
            "0x1fc35B79FB11Ea7D4532dA128DfA9Db573C51b09",
            true
          )
        ).toBeTruthy();
      });
    }
  );

  test.each(["testing", "staging", "production"])(
    `check the default tokens info is available in each configs for %p env`,
    (envName) => {
      const envConfigs = getEnvConfigs(envName as EnvironmentType);
      envConfigs.forEach((envConfig) => {
        const defaultTokens = chainIdToDefaultTokens.get(envConfig.chainId);
        expect(defaultTokens).toBeTruthy();
      });
    }
  );

  test.each([1, 137, 80002, 11155111, 84532, 8453])(
    `Chain Id %p is available`,
    (chainId) => {
      expect(chains[chainId]).toBeTruthy();
    }
  );
});
