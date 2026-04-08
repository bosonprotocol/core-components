import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import * as erc20Handler from "../../src/erc20/handler";
import { signNativeMetaTxApproveExchangeToken } from "../../src/native-meta-tx/handler";
import { UnsignedMetaTx } from "../../src/meta-tx/handler";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAIN_ID = 137; // Polygon mainnet – representative for native meta-tx
const EXCHANGE_TOKEN = "0x0000000000000000000000000000000000000010";
const SPENDER = "0x0000000000000000000000000000000000000011";
const USER = "0x0000000000000000000000000000000000000012";
const VALUE = "1000000000000000000";
// Real-looking ECDSA signature from MockWeb3LibAdapter.send()
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";
const EXPECTED_R =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd";
const EXPECTED_S =
  "0x72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a";
const EXPECTED_V = 27;
// ABI-encoded uint256(1) – returned as nonce by MockWeb3LibAdapter.call()
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWeb3Lib() {
  return new MockWeb3LibAdapter({
    getSignerAddress: USER,
    send: MOCK_SIG,
    call: ABI_UINT256_ONE
  });
}

function baseArgs() {
  return {
    web3Lib: makeWeb3Lib(),
    chainId: CHAIN_ID,
    user: USER,
    exchangeToken: EXCHANGE_TOKEN,
    spender: SPENDER,
    value: VALUE
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("signNativeMetaTxApproveExchangeToken()", () => {
  beforeEach(() => {
    // Avoid real ERC20 contract call for token name
    jest.spyOn(erc20Handler, "getName").mockResolvedValue("TestToken");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns SignedMetaTx when returnTypedDataToSign is omitted", async () => {
    const result = await signNativeMetaTxApproveExchangeToken(baseArgs());
    expect(result.functionName).toBe("approve(address,uint256)");
    expect(result.r).toBe(EXPECTED_R);
    expect(result.s).toBe(EXPECTED_S);
    expect(result.v).toBe(EXPECTED_V);
    expect(typeof result.functionSignature).toBe("string");
    expect(result.functionSignature.startsWith("0x")).toBe(true);
  });

  test("returns SignedMetaTx when returnTypedDataToSign: false", async () => {
    const result = await signNativeMetaTxApproveExchangeToken({
      ...baseArgs(),
      returnTypedDataToSign: false
    });
    expect(result.functionName).toBe("approve(address,uint256)");
    expect(result.r).toBe(EXPECTED_R);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    const result = await signNativeMetaTxApproveExchangeToken({
      ...baseArgs(),
      returnTypedDataToSign: true
    });
    const data = result as UnsignedMetaTx;
    expect(data.primaryType).toBe("MetaTransaction");
    // verifyingContract is the exchange token (the native meta-tx contract)
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe("TestToken");
    expect(Array.isArray(data.types.EIP712Domain)).toBe(true);
    expect(typeof data.message).toBe("object");
    expect(data.message.from).toBe(USER);
    // Must NOT look like a SignedMetaTx
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
    // Confirm UnsignedMetaTx fields are present
    expect(data.functionName).toBe("approve(address,uint256)");
    expect(typeof data.functionSignature).toBe("string");
  });

  test("uses the token name returned by getERC20Name as domain.name", async () => {
    (erc20Handler.getName as jest.Mock).mockResolvedValue("USD Coin");
    const result = await signNativeMetaTxApproveExchangeToken({
      ...baseArgs(),
      returnTypedDataToSign: true
    });
    expect((result as UnsignedMetaTx).domain.name).toBe("USD Coin");
  });

  test("encodes the correct spender and value in functionSignature", async () => {
    const result = await signNativeMetaTxApproveExchangeToken(baseArgs());
    // functionSignature should be the ABI encoding of approve(spender, value)
    // Selector for approve(address,uint256) is 0x095ea7b3
    expect(result.functionSignature.startsWith("0x095ea7b3")).toBe(true);
  });
});
