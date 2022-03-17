import { abis, getDefaultConfig, defaultConfigs } from "../src/index";

describe("index entrypoint", () => {
  test("export abis", () => {
    expect(abis.IBosonOfferHandlerABI).toBeTruthy();
    expect(abis.ProtocolDiamondABI).toBeTruthy();
  });

  test("export default configs", () => {
    expect(defaultConfigs).toBeTruthy();
    expect(getDefaultConfig).toBeTruthy();
  });
});
