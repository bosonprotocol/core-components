import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { CoreSDK } from "../src/core-sdk";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import {
  mockRawOfferFromSubgraph,
  buildProductV1Metadata,
  interceptSubgraph,
  SUBGRAPH_URL
} from "./mocks";

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

describe("#renderContractualAgreementForOffer()", () => {
  const offerId = "1";

  test("return rendered template for offer", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
      price: "100" + "0".repeat(18),
      metadata: buildProductV1Metadata("{{priceValue}} {{exchangeTokenSymbol}}")
    });
    interceptSubgraph().reply(200, {
      data: {
        offer: mockedRawOfferFromSubgraph
      }
    });
    const defaultConfig = getDefaultConfig({ envName: "testing" });
    const coreSDK = new CoreSDK({
      web3Lib: new MockWeb3LibAdapter(),
      subgraphUrl: SUBGRAPH_URL,
      protocolDiamond: defaultConfig.contracts.protocolDiamond
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
    expect(mockedRawOfferFromSubgraph.id).toEqual(offerId);
    const render = await coreSDK.renderContractualAgreementForOffer(
      mockedRawOfferFromSubgraph.id
    );
    expect(render).toEqual("100.0 ETH");
  });

  test("Not existing offer", async () => {
    const mockedRawOfferFromSubgraph = mockRawOfferFromSubgraph({
      price: "100" + "0".repeat(18),
      metadata: buildProductV1Metadata("{{priceValue}} {{exchangeTokenSymbol}}")
    });
    interceptSubgraph().reply(200, {
      data: {
        offer: null
      }
    });
    const defaultConfig = getDefaultConfig({ envName: "testing" });
    const coreSDK = new CoreSDK({
      web3Lib: new MockWeb3LibAdapter(),
      subgraphUrl: SUBGRAPH_URL,
      protocolDiamond: defaultConfig.contracts.protocolDiamond
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
    await expect(
      coreSDK.renderContractualAgreementForOffer(offerId)
    ).rejects.toThrowError(/^offerData is undefined/);
  });
});
