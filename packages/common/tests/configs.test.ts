import { isAddress } from "@ethersproject/address";
import { getDefaultConfig } from "../src/configs";
import { EnvironmentType } from "../src/types";

describe("#getDefaultConfig()", () => {
  test("throw if filter not set", () => {
    expect(() => {
      getDefaultConfig(undefined as unknown as EnvironmentType);
    }).toThrow();
  });

  test("throw if unknown env name", () => {
    expect(() => {
      getDefaultConfig("unknown" as EnvironmentType);
    }).toThrow();
  });

  test("return default config of env", () => {
    const { chainId, contracts, subgraphUrl } = getDefaultConfig("local");
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });
});
