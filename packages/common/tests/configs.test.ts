import { isAddress } from "@ethersproject/address";
import { getDefaultConfig } from "../src/configs";

describe("#getDefaultConfig()", () => {
  test("throw if filter not set", () => {
    expect(() => {
      getDefaultConfig({});
    }).toThrow();
  });

  test("throw if unknown env name", () => {
    expect(() => {
      getDefaultConfig({
        envName: "unknown"
      });
    }).toThrow();
  });

  test("throw if unknown chain id", () => {
    expect(() => {
      getDefaultConfig({
        chainId: 99999999999999
      });
    }).toThrow();
  });

  test("return default config of env", () => {
    const { chainId, contracts, subgraphUrl } = getDefaultConfig({
      envName: "local"
    });
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });

  test("return default config of chain id", () => {
    const { chainId, contracts, subgraphUrl } = getDefaultConfig({
      chainId: 31337
    });
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });
});
