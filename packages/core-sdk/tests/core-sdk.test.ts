import { Web3LibAdapter, EnvironmentType } from "@bosonprotocol/common";
import { getDefaultConfig } from "@bosonprotocol/core-sdk";
import { CoreSDK } from "../src/core-sdk";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import {
  mockRawOfferFromSubgraph,
  buildProductV1Metadata,
  interceptSubgraph,
  SUBGRAPH_URL,
  ZERO_ADDRESS,
  mockRawSellerFromSubgraph
} from "./mocks";
import { ADDRESS } from "@bosonprotocol/common/tests/mocks";

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
        envName: "unknown" as EnvironmentType
      })
    ).toThrow();
  });

  test("throw for if env not set", () => {
    expect(() =>
      CoreSDK.fromDefaultConfig({
        web3Lib: new MockWeb3LibAdapter()
      } as unknown as { envName: EnvironmentType; web3Lib: Web3LibAdapter })
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
    interceptSubgraph("getOfferByIdQuery").reply(200, {
      data: {
        offer: mockedRawOfferFromSubgraph
      }
    });
    interceptSubgraph("getProductV1MetadataEntityByIdQuery").reply(200, {
      data: {
        productV1MetadataEntity: mockedRawOfferFromSubgraph.metadata
      }
    });
    const defaultConfig = getDefaultConfig("testing");
    const coreSDK = new CoreSDK({
      web3Lib: new MockWeb3LibAdapter(),
      subgraphUrl: SUBGRAPH_URL,
      protocolDiamond: defaultConfig.contracts.protocolDiamond,
      chainId: defaultConfig.chainId
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
    const defaultConfig = getDefaultConfig("testing");
    const coreSDK = new CoreSDK({
      web3Lib: new MockWeb3LibAdapter(),
      subgraphUrl: SUBGRAPH_URL,
      protocolDiamond: defaultConfig.contracts.protocolDiamond,
      chainId: defaultConfig.chainId
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
    await expect(
      coreSDK.renderContractualAgreementForOffer(offerId)
    ).rejects.toThrowError(/^offerData is undefined/);
  });
});

describe("getSellersByAddress()", () => {
  test("shall fail if search address is ZERO_ADDRESS", async () => {
    const mockedRawSellerFromSubgraph = mockRawSellerFromSubgraph({
      operator: ADDRESS
    });
    interceptSubgraph().reply(200, {
      data: {
        sellers: [mockedRawSellerFromSubgraph]
      }
    });
    const defaultConfig = getDefaultConfig("testing");
    const coreSDK = new CoreSDK({
      web3Lib: new MockWeb3LibAdapter(),
      subgraphUrl: SUBGRAPH_URL,
      protocolDiamond: defaultConfig.contracts.protocolDiamond,
      chainId: defaultConfig.chainId
    });
    expect(coreSDK).toBeInstanceOf(CoreSDK);
    await expect(
      coreSDK.getSellersByAddress(ZERO_ADDRESS)
    ).rejects.toThrowError(
      /^Unsupported search address '0x0000000000000000000000000000000000000000'/
    );
  });
});
