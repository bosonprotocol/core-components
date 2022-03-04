import { isAddress } from "@ethersproject/address";
import { getAddressesByEnv } from "../src/addresses";

describe("#getAddressesByEnv()", () => {
  test("throw if unknown env name", () => {
    expect(() => {
      getAddressesByEnv("unknown");
    }).toThrow();
  });

  test("return addresses of env", () => {
    const { chainId, protocolDiamond } = getAddressesByEnv("local");
    expect(typeof chainId === "number").toBeTruthy();
    expect(isAddress(protocolDiamond)).toBeTruthy();
  });
});
