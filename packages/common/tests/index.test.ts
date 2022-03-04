import { abis, addresses, getAddressesByEnv, offerHandler } from "../src/index";

describe("index entrypoint", () => {
  test("export abis", () => {
    expect(abis.IBosonOfferHandlerABI).toBeTruthy();
    expect(abis.ProtocolDiamondABI).toBeTruthy();
  });

  test("export addresses", () => {
    expect(addresses).toBeTruthy();
    expect(getAddressesByEnv).toBeTruthy();
  });

  test("export offerHandler", () => {
    expect(offerHandler).toBeTruthy();
  });
});
