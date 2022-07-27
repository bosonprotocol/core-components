import { CoreSDK } from "../src/core-sdk";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";

describe("#fromDefaultConfig()", () => {
  test("construct using default config from env name", () => {
    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new MockWeb3LibAdapter(),
      envName: "testing"
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
  });

  test("throw for unknown env name", () => {
    expect(() =>
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter(),
        envName: "unknown"
      })
    ).toThrow();
  });

  test("construct using default config from chain id", () => {
    const coreSDK = CoreSDK.fromDefaultConfig({
      web3Lib: new MockWeb3LibAdapter(),
      chainId: 1234
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
  });

  test("throw for unknown chain id", () => {
    expect(() =>
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter(),
        chainId: 9999999999
      })
    ).toThrow();
  });

  test("throw for if chainId and env not set", () => {
    expect(() =>
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter()
      })
    ).toThrow();
  });
});
