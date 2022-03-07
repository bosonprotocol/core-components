import { isAddress } from "@ethersproject/address";
import { getDefaultConfigByEnvName } from "../src/configs";

describe("#getDefaultConfigByEnvName()", () => {
  test("throw if unknown env name", () => {
    expect(() => {
      getDefaultConfigByEnvName("unknown");
    }).toThrow();
  });

  test("return default config of env", () => {
    const { chainId, contracts, subgraphUrl } =
      getDefaultConfigByEnvName("local");
    expect(typeof chainId === "number").toBeTruthy();
    expect(typeof subgraphUrl === "string").toBeTruthy();
    expect(isAddress(contracts.protocolDiamond)).toBeTruthy();
  });
});
