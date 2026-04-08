import { abis } from "@bosonprotocol/common";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import * as erc20Handler from "../../src/erc20/handler";
import * as nativeMetaTxHandler from "../../src/native-meta-tx/handler";
import { CoreSDK } from "../../src/core-sdk";
import { StructuredData } from "../../src/utils/signature";
import { BICONOMY_URL, SUBGRAPH_URL } from "../mocks";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAIN_ID = 31337;
const PROTOCOL_DIAMOND = "0x0000000000000000000000000000000000000001";
const PRICE_DISCOVERY = "0x0000000000000000000000000000000000000002";
const FORWARDER = "0x0000000000000000000000000000000000000003";
const SIGNER = "0x0000000000000000000000000000000000000004";
const EXCHANGE_TOKEN = "0x0000000000000000000000000000000000000010";
const CUSTOM_SPENDER = "0x0000000000000000000000000000000000000011";
const VALUE = "1000000000000000000";
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// ─── Factory ──────────────────────────────────────────────────────────────────

function makeCoreSDK() {
  return new CoreSDK({
    web3Lib: new MockWeb3LibAdapter({
      getSignerAddress: SIGNER,
      send: MOCK_SIG,
      call: ABI_UINT256_ONE
    }),
    subgraphUrl: SUBGRAPH_URL,
    protocolDiamond: PROTOCOL_DIAMOND,
    chainId: CHAIN_ID,
    metaTx: {
      relayerUrl: BICONOMY_URL,
      apiKey: "test-api-key",
      apiIds: {
        [PROTOCOL_DIAMOND.toLowerCase()]: {
          executeMetaTransaction: "test-api-id"
        }
      },
      forwarderAbi: abis.MockForwarderABI
    },
    contracts: {
      protocolDiamond: PROTOCOL_DIAMOND,
      priceDiscoveryClient: PRICE_DISCOVERY,
      forwarder: FORWARDER
    }
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("NativeMetaTxMixin#signNativeMetaTxApproveExchangeToken()", () => {
  beforeEach(() => {
    jest.spyOn(erc20Handler, "getName").mockResolvedValue("TestToken");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── overload dispatch ──────────────────────────────────────────────────────

  test("returns SignedMetaTx when overrides is omitted", async () => {
    const result = await makeCoreSDK().signNativeMetaTxApproveExchangeToken(
      EXCHANGE_TOKEN,
      VALUE
    );
    expect(result.functionName).toBe("approve(address,uint256)");
    expect(typeof result.r).toBe("string");
    expect(typeof result.s).toBe("string");
    expect(typeof result.v).toBe("number");
  });

  test("returns SignedMetaTx when returnTypedDataToSign: false", async () => {
    const result = await makeCoreSDK().signNativeMetaTxApproveExchangeToken(
      EXCHANGE_TOKEN,
      VALUE,
      { returnTypedDataToSign: false }
    );
    expect(result.functionName).toBe("approve(address,uint256)");
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDK().signNativeMetaTxApproveExchangeToken as any
    )(EXCHANGE_TOKEN, VALUE, { returnTypedDataToSign: true });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("MetaTransaction");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe("TestToken");
    expect(typeof data.message).toBe("object");
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
  });

  // ── argument injection ─────────────────────────────────────────────────────

  test("defaults spender to protocolDiamond when not provided", async () => {
    const spy = jest
      .spyOn(nativeMetaTxHandler, "signNativeMetaTxApproveExchangeToken")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signNativeMetaTxApproveExchangeToken(
      EXCHANGE_TOKEN,
      VALUE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: PROTOCOL_DIAMOND })
    );
  });

  test("uses the provided spender override", async () => {
    const spy = jest
      .spyOn(nativeMetaTxHandler, "signNativeMetaTxApproveExchangeToken")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signNativeMetaTxApproveExchangeToken(
      EXCHANGE_TOKEN,
      VALUE,
      { spender: CUSTOM_SPENDER }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: CUSTOM_SPENDER })
    );
  });

  test("injects the signer address as user", async () => {
    const spy = jest
      .spyOn(nativeMetaTxHandler, "signNativeMetaTxApproveExchangeToken")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signNativeMetaTxApproveExchangeToken(
      EXCHANGE_TOKEN,
      VALUE
    );

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ user: SIGNER }));
  });

  test("passes returnTypedDataToSign: true through to the handler", async () => {
    const spy = jest
      .spyOn(nativeMetaTxHandler, "signNativeMetaTxApproveExchangeToken")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (makeCoreSDK().signNativeMetaTxApproveExchangeToken as any)(
      EXCHANGE_TOKEN,
      VALUE,
      { returnTypedDataToSign: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTypedDataToSign: true })
    );
  });
});
