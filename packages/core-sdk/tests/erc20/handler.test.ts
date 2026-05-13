import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { defaultAbiCoder } from "@ethersproject/abi";
import { MaxUint256 } from "@ethersproject/constants";
import {
  signReceiveWithErc3009Authorization,
  signReceiveWithErc2612Permit
} from "../../src/erc20/handler";
import { StructuredData } from "../../src/utils/signature";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAIN_ID = 31337;
const EXCHANGE_TOKEN = "0x0000000000000000000000000000000000000010";
const SPENDER = "0x0000000000000000000000000000000000000011";
const USER = "0x0000000000000000000000000000000000000012";
const VALUE = "1000000000000000000";
const VALID_AFTER = "0";
const VALID_BEFORE = MaxUint256.toString();
const TOKEN_DOMAIN = { name: "ERC3009Token", version: "1" };
// Real-looking ECDSA signature from MockWeb3LibAdapter.send()
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";
const EXPECTED_R =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd";
const EXPECTED_S =
  "0x72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a";
const EXPECTED_V = 27;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWeb3Lib() {
  return new MockWeb3LibAdapter({
    getSignerAddress: USER,
    send: MOCK_SIG
  });
}

function baseArgs() {
  return {
    web3Lib: makeWeb3Lib(),
    chainId: CHAIN_ID,
    user: USER,
    exchangeToken: EXCHANGE_TOKEN,
    spender: SPENDER,
    value: VALUE,
    tokenDomain: TOKEN_DOMAIN,
    validAfter: VALID_AFTER,
    validBefore: VALID_BEFORE
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("signReceiveWithErc3009Authorization()", () => {
  test("returns SignedReceiveWithAuthorization when returnTypedDataToSign is omitted", async () => {
    const result = await signReceiveWithErc3009Authorization(baseArgs());
    expect(result.r).toBe(EXPECTED_R);
    expect(result.s).toBe(EXPECTED_S);
    expect(result.v).toBe(EXPECTED_V);
    expect(result.signature).toBe(MOCK_SIG);
    expect(typeof result.abiData).toBe("string");
    expect(result.abiData.startsWith("0x")).toBe(true);
  });

  test("returns SignedReceiveWithAuthorization when returnTypedDataToSign: false", async () => {
    const result = await signReceiveWithErc3009Authorization({
      ...baseArgs(),
      returnTypedDataToSign: false
    });
    expect(result.r).toBe(EXPECTED_R);
    expect(result.s).toBe(EXPECTED_S);
    expect(result.v).toBe(EXPECTED_V);
    expect(typeof result.abiData).toBe("string");
  });

  test("abiData decodes to [validAfter, validBefore, nonce, v, r, s]", async () => {
    const result = await signReceiveWithErc3009Authorization(baseArgs());
    const [validAfter, validBefore, nonce, v, r, s] = defaultAbiCoder.decode(
      ["uint256", "uint256", "bytes32", "uint8", "bytes32", "bytes32"],
      result.abiData
    );
    expect(validAfter.toString()).toBe(VALID_AFTER);
    expect(validBefore.toString()).toBe(VALID_BEFORE);
    expect(typeof nonce).toBe("string");
    expect((nonce as string).startsWith("0x")).toBe(true);
    expect((nonce as string).length).toBe(2 + 64); // 32 bytes hex
    expect(Number(v)).toBe(EXPECTED_V);
    expect(r).toBe(EXPECTED_R);
    expect(s).toBe(EXPECTED_S);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    const result = await signReceiveWithErc3009Authorization({
      ...baseArgs(),
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("ReceiveWithAuthorization");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe(TOKEN_DOMAIN.name);
    expect(data.domain.version).toBe(TOKEN_DOMAIN.version);
    // chainId-form domain, NOT salt-form
    expect((data.domain as { chainId?: number | string }).chainId).toBe(
      CHAIN_ID
    );
    expect((data.domain as { salt?: string }).salt).toBeUndefined();
    // EIP712Domain type must declare chainId, not salt
    const domainTypeNames = data.types.EIP712Domain.map((t) => t.name);
    expect(domainTypeNames).toContain("chainId");
    expect(domainTypeNames).not.toContain("salt");
    // Message fields
    expect(data.message.from).toBe(USER);
    expect(data.message.to).toBe(SPENDER);
    expect(data.message.value).toBe(VALUE);
    expect(data.message.validAfter).toBe(VALID_AFTER);
    expect(data.message.validBefore).toBe(VALID_BEFORE);
    // nonce is a 0x-prefixed 32-byte hex string
    const nonce = data.message.nonce as string;
    expect(typeof nonce).toBe("string");
    expect(nonce.startsWith("0x")).toBe(true);
    expect(nonce.length).toBe(2 + 64);
    // Must NOT look like a SignedReceiveWithAuthorization
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
    expect((data as unknown as { abiData?: unknown }).abiData).toBeUndefined();
  });

  test("each call produces a fresh random nonce", async () => {
    const a = await signReceiveWithErc3009Authorization({
      ...baseArgs(),
      returnTypedDataToSign: true
    });
    const b = await signReceiveWithErc3009Authorization({
      ...baseArgs(),
      returnTypedDataToSign: true
    });
    expect(a.message.nonce).not.toBe(b.message.nonce);
  });
});

// ─── EIP-2612 tests ───────────────────────────────────────────────────────────

const DEADLINE = MaxUint256.toString();
const ERC2612_TOKEN_DOMAIN = { name: "ERC2612Token", version: "1" };
// ABI-encoded uint256(1) — returned as the on-chain `nonces(owner)` value.
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

function makeWeb3LibForPermit() {
  return new MockWeb3LibAdapter({
    getSignerAddress: USER,
    send: MOCK_SIG,
    call: ABI_UINT256_ONE
  });
}

function permitBaseArgs() {
  return {
    web3Lib: makeWeb3LibForPermit(),
    chainId: CHAIN_ID,
    user: USER,
    exchangeToken: EXCHANGE_TOKEN,
    spender: SPENDER,
    value: VALUE,
    tokenDomain: ERC2612_TOKEN_DOMAIN,
    deadline: DEADLINE
  };
}

describe("signReceiveWithErc2612Permit()", () => {
  test("returns SignedReceivePermit when returnTypedDataToSign is omitted", async () => {
    const result = await signReceiveWithErc2612Permit(permitBaseArgs());
    expect(result.r).toBe(EXPECTED_R);
    expect(result.s).toBe(EXPECTED_S);
    expect(result.v).toBe(EXPECTED_V);
    expect(result.signature).toBe(MOCK_SIG);
    expect(typeof result.abiData).toBe("string");
    expect(result.abiData.startsWith("0x")).toBe(true);
  });

  test("returns SignedReceivePermit when returnTypedDataToSign: false", async () => {
    const result = await signReceiveWithErc2612Permit({
      ...permitBaseArgs(),
      returnTypedDataToSign: false
    });
    expect(result.r).toBe(EXPECTED_R);
    expect(typeof result.abiData).toBe("string");
  });

  test("abiData decodes to [deadline, v, r, s]", async () => {
    const result = await signReceiveWithErc2612Permit(permitBaseArgs());
    const [deadline, v, r, s] = defaultAbiCoder.decode(
      ["uint256", "uint8", "bytes32", "bytes32"],
      result.abiData
    );
    expect(deadline.toString()).toBe(DEADLINE);
    expect(Number(v)).toBe(EXPECTED_V);
    expect(r).toBe(EXPECTED_R);
    expect(s).toBe(EXPECTED_S);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    const result = await signReceiveWithErc2612Permit({
      ...permitBaseArgs(),
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("Permit");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe(ERC2612_TOKEN_DOMAIN.name);
    expect(data.domain.version).toBe(ERC2612_TOKEN_DOMAIN.version);
    expect((data.domain as { chainId?: number | string }).chainId).toBe(
      CHAIN_ID
    );
    expect((data.domain as { salt?: string }).salt).toBeUndefined();
    const domainTypeNames = data.types.EIP712Domain.map((t) => t.name);
    expect(domainTypeNames).toContain("chainId");
    expect(domainTypeNames).not.toContain("salt");
    // Message fields use the EIP-2612 schema.
    expect(data.message.owner).toBe(USER);
    expect(data.message.spender).toBe(SPENDER);
    expect(data.message.value).toBe(VALUE);
    expect(data.message.nonce).toBe("1");
    expect(data.message.deadline).toBe(DEADLINE);
    // Must NOT look like a SignedReceivePermit
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
    expect((data as unknown as { abiData?: unknown }).abiData).toBeUndefined();
  });

  test("reads nonce from the token contract via nonces(owner)", async () => {
    const ABI_UINT256_SEVEN =
      "0x0000000000000000000000000000000000000000000000000000000000000007";
    const web3Lib = new MockWeb3LibAdapter({
      getSignerAddress: USER,
      send: MOCK_SIG,
      call: ABI_UINT256_SEVEN
    });
    const data = await signReceiveWithErc2612Permit({
      ...permitBaseArgs(),
      web3Lib,
      returnTypedDataToSign: true
    });
    expect(data.message.nonce).toBe("7");
  });
});
