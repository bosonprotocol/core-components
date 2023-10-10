import { isAddress } from "@ethersproject/address";
import { getEnvConfigs, getEnvConfigById } from "../src/configs";
import { ConfigId, EnvironmentType } from "../src/types";

describe("#getEnvConfigs()", () => {
  test("throw if filter not set", () => {
    expect(() => {
      getEnvConfigs(undefined as unknown as EnvironmentType);
    }).toThrow();
  });

  test("throw if unknown env name", () => {
    expect(() => {
      getEnvConfigs("unknown" as EnvironmentType);
    }).toThrow();
  });

  test("return first config of env", () => {
    const { chainId, contracts, subgraphUrl } = getEnvConfigs("local")[0];
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });
});

describe("#getEnvConfigById()", () => {
  test("throw if filter not set", () => {
    expect(() => {
      getEnvConfigById(
        undefined as unknown as EnvironmentType,
        undefined as unknown as ConfigId
      );
    }).toThrow();
  });

  test("throw if unknown env name", () => {
    expect(() => {
      getEnvConfigById("unknown" as EnvironmentType, "local-31337-0");
    }).toThrow();
  });

  test("throw if unknown configId", () => {
    expect(() => {
      getEnvConfigById("local" as EnvironmentType, "unknown" as ConfigId);
    }).toThrow();
  });

  test("return config of env", () => {
    const { chainId, contracts, subgraphUrl } = getEnvConfigById(
      "local",
      "local-31337-0"
    );
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });
});
