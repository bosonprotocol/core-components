import {
  abis,
  getEnvConfigs,
  getEnvConfigById,
  envConfigs
} from "../src/index";

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
});
