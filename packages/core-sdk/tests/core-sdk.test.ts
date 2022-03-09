import { CoreSDK } from "../src/core-sdk";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";

describe("#fromDefaultConfig()", () => {
  test("construct using default config from env name", async () => {
    const coreSDK = await CoreSDK.fromDefaultConfig({
      web3Lib: new MockWeb3LibAdapter(),
      envName: "testing"
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
  });

  test("throw for unknown env name", async () => {
    await expect(
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter(),
        envName: "unknown"
      })
    ).rejects.toThrow();
  });

  test("construct using default config from chain id", async () => {
    const coreSDK = await CoreSDK.fromDefaultConfig({
      web3Lib: new MockWeb3LibAdapter(),
      chainId: 3
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
  });

  test("throw for unknown chain id", async () => {
    await expect(
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter(),
        chainId: 9999999999
      })
    ).rejects.toThrow();
  });

  test("construct using default config from web3 lib chain id", async () => {
    const coreSDK = await CoreSDK.fromDefaultConfig({
      web3Lib: new MockWeb3LibAdapter({
        getChainId: 3
      })
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
  });

  test("throw for unknown web3 lib chain id", async () => {
    await expect(
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter({
          getChainId: 99999999999
        })
      })
    ).rejects.toThrow();
  });
});
