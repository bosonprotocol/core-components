import { isAddress } from "@ethersproject/address";
import { getDefaultConfig } from "../src/configs";

describe("#getDefaultConfig()", () => {
  test("throw if filter not set", () => {
    expect(() => {
      getDefaultConfig({} as { envName: string; });
    }).toThrow();
  });

  test("throw if unknown env name", () => {
    expect(() => {
      getDefaultConfig({
        envName: "unknown"
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

});
