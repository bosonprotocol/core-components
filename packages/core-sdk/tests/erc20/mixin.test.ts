import { abis } from "@bosonprotocol/common";
import { MockWeb3LibAdapter } from "@bosonprotocol/common/tests/mocks";
import { MaxUint256 } from "@ethersproject/constants";
import * as erc20Handler from "../../src/erc20/handler";
import { CoreSDK } from "../../src/core-sdk";
import { StructuredData } from "../../src/utils/signature";
import { BICONOMY_URL, SUBGRAPH_URL } from "../mocks";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAIN_ID = 31337;
const PROTOCOL_DIAMOND = "0x0000000000000000000000000000000000000001";
const PRICE_DISCOVERY = "0x0000000000000000000000000000000000000002";
const FORWARDER = "0x0000000000000000000000000000000000000003";
const PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const SIGNER = "0x0000000000000000000000000000000000000004";
const EXCHANGE_TOKEN = "0x0000000000000000000000000000000000000010";
const CUSTOM_SPENDER = "0x0000000000000000000000000000000000000011";
const VALUE = "1000000000000000000";
const VALID_AFTER = "0";
const VALID_BEFORE = MaxUint256.toString();
const TOKEN_DOMAIN = { name: "ERC3009Token", version: "1" };
const MOCK_SIG =
  "0x020d671b80fbd20466d8cb65cef79a24e3bca3fdf82e9dd89d78e7a4c4c045bd72944c20bb1d839e76ee6bb69fed61f64376c37799598b40b8c49148f3cdd88a1b";

// ─── Factory ──────────────────────────────────────────────────────────────────

function makeCoreSDK() {
  return new CoreSDK({
    web3Lib: new MockWeb3LibAdapter({
      getSignerAddress: SIGNER,
      send: MOCK_SIG
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
      forwarder: FORWARDER,
      permit2: PERMIT2
    }
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ERC20Mixin#signReceiveWithErc3009Authorization()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── overload dispatch ──────────────────────────────────────────────────────

  test("returns a TransferAuthorization tagged ERC3009 when overrides is omitted", async () => {
    const result = await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE
    );
    expect(typeof result.r).toBe("string");
    expect(typeof result.s).toBe("string");
    expect(typeof result.v).toBe("number");
    expect(typeof result.signature).toBe("string");
    expect(result.strategy).toBe("ERC3009");
    expect(result.data.validAfter).toBe(VALID_AFTER);
    expect(result.data.validBefore).toBe(VALID_BEFORE);
    expect(typeof result.data.nonce).toBe("string");
  });

  test("returns a TransferAuthorization tagged ERC3009 when returnTypedDataToSign: false", async () => {
    const result = await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE,
      { returnTypedDataToSign: false }
    );
    expect(result.strategy).toBe("ERC3009");
    expect(result.data.validAfter).toBe(VALID_AFTER);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDK().signReceiveWithErc3009Authorization as any
    )(EXCHANGE_TOKEN, TOKEN_DOMAIN, VALUE, VALID_AFTER, VALID_BEFORE, {
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("ReceiveWithAuthorization");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe(TOKEN_DOMAIN.name);
    expect((data.domain as { chainId?: number }).chainId).toBe(CHAIN_ID);
    expect((data.domain as { salt?: string }).salt).toBeUndefined();
    expect(data.message.from).toBe(SIGNER);
    expect(data.message.to).toBe(PROTOCOL_DIAMOND);
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
  });

  // ── argument injection ─────────────────────────────────────────────────────

  test("defaults spender to protocolDiamond when not provided", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc3009Authorization")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: PROTOCOL_DIAMOND })
    );
  });

  test("uses the provided spender override", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc3009Authorization")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE,
      { spender: CUSTOM_SPENDER }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: CUSTOM_SPENDER })
    );
  });

  test("injects the signer address as user", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc3009Authorization")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE
    );

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ user: SIGNER }));
  });

  test("passes returnTypedDataToSign: true through to the handler", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc3009Authorization")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (makeCoreSDK().signReceiveWithErc3009Authorization as any)(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE,
      { returnTypedDataToSign: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTypedDataToSign: true })
    );
  });

  test("forwards tokenDomain, validAfter and validBefore to the handler", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc3009Authorization")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDK().signReceiveWithErc3009Authorization(
      EXCHANGE_TOKEN,
      TOKEN_DOMAIN,
      VALUE,
      VALID_AFTER,
      VALID_BEFORE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenDomain: TOKEN_DOMAIN,
        validAfter: VALID_AFTER,
        validBefore: VALID_BEFORE,
        exchangeToken: EXCHANGE_TOKEN,
        value: VALUE,
        chainId: CHAIN_ID
      })
    );
  });
});

// ─── EIP-2612 mixin tests ─────────────────────────────────────────────────────

const DEADLINE = MaxUint256.toString();
const ERC2612_TOKEN_DOMAIN = { name: "ERC2612Token", version: "1" };
const ABI_UINT256_ONE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

function makeCoreSDKForPermit() {
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
      forwarder: FORWARDER,
      permit2: PERMIT2
    }
  });
}

describe("ERC20Mixin#signReceiveWithErc2612Permit()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── overload dispatch ──────────────────────────────────────────────────────

  test("returns a TransferAuthorization tagged EIP2612 when overrides is omitted", async () => {
    const result = await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE
    );
    expect(typeof result.r).toBe("string");
    expect(typeof result.s).toBe("string");
    expect(typeof result.v).toBe("number");
    expect(typeof result.signature).toBe("string");
    expect(result.strategy).toBe("EIP2612");
    expect(result.data.deadline).toBe(DEADLINE);
  });

  test("returns a TransferAuthorization tagged EIP2612 when returnTypedDataToSign: false", async () => {
    const result = await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE,
      { returnTypedDataToSign: false }
    );
    expect(result.strategy).toBe("EIP2612");
    expect(result.data.deadline).toBe(DEADLINE);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDKForPermit().signReceiveWithErc2612Permit as any
    )(EXCHANGE_TOKEN, ERC2612_TOKEN_DOMAIN, VALUE, DEADLINE, {
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("Permit");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe(ERC2612_TOKEN_DOMAIN.name);
    expect((data.domain as { chainId?: number }).chainId).toBe(CHAIN_ID);
    expect((data.domain as { salt?: string }).salt).toBeUndefined();
    expect(data.message.owner).toBe(SIGNER);
    expect(data.message.spender).toBe(PROTOCOL_DIAMOND);
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
  });

  // ── argument injection ─────────────────────────────────────────────────────

  test("defaults spender to protocolDiamond when not provided", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc2612Permit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: PROTOCOL_DIAMOND })
    );
  });

  test("uses the provided spender override", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc2612Permit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE,
      { spender: CUSTOM_SPENDER }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: CUSTOM_SPENDER })
    );
  });

  test("injects the signer address as user", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc2612Permit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE
    );

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ user: SIGNER }));
  });

  test("passes returnTypedDataToSign: true through to the handler", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc2612Permit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (makeCoreSDKForPermit().signReceiveWithErc2612Permit as any)(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE,
      { returnTypedDataToSign: true }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ returnTypedDataToSign: true })
    );
  });

  test("forwards tokenDomain and deadline to the handler", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithErc2612Permit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithErc2612Permit(
      EXCHANGE_TOKEN,
      ERC2612_TOKEN_DOMAIN,
      VALUE,
      DEADLINE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenDomain: ERC2612_TOKEN_DOMAIN,
        deadline: DEADLINE,
        exchangeToken: EXCHANGE_TOKEN,
        value: VALUE,
        chainId: CHAIN_ID
      })
    );
  });
});

// ─── Permit2 mixin tests ──────────────────────────────────────────────────────

const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const PERMIT2_OVERRIDE = "0x000000000000000000000000000000000000ABCD";
const PERMIT2_NONCE = "42";

function makeCoreSDKForPermit2(opts: { withPermit2?: boolean } = {}) {
  return new CoreSDK({
    web3Lib: new MockWeb3LibAdapter({
      getSignerAddress: SIGNER,
      send: MOCK_SIG
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
    contracts:
      opts.withPermit2 === false
        ? undefined
        : {
            protocolDiamond: PROTOCOL_DIAMOND,
            priceDiscoveryClient: PRICE_DISCOVERY,
            forwarder: FORWARDER,
            permit2: PERMIT2_ADDRESS
          }
  });
}

describe("ERC20Mixin#signReceiveWithPermit2()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── overload dispatch ──────────────────────────────────────────────────────

  test("returns a TransferAuthorization tagged Permit2 when overrides is omitted", async () => {
    const result = await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE
    );
    expect(typeof result.r).toBe("string");
    expect(typeof result.s).toBe("string");
    expect(typeof result.v).toBe("number");
    expect(typeof result.signature).toBe("string");
    expect(result.strategy).toBe("Permit2");
    expect(result.data.deadline).toBe(DEADLINE);
  });

  test("returns a TransferAuthorization tagged Permit2 when returnTypedDataToSign: false", async () => {
    const result = await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE,
      { returnTypedDataToSign: false }
    );
    expect(result.strategy).toBe("Permit2");
    expect(result.data.deadline).toBe(DEADLINE);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDKForPermit2().signReceiveWithPermit2 as any
    )(EXCHANGE_TOKEN, VALUE, DEADLINE, { returnTypedDataToSign: true });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("PermitTransferFrom");
    expect(data.domain.name).toBe("Permit2");
    expect(data.domain.verifyingContract).toBe(PERMIT2_ADDRESS);
    expect((data.domain as { version?: string }).version).toBeUndefined();
    expect((data as unknown as { r?: unknown }).r).toBeUndefined();
  });

  // ── argument injection ─────────────────────────────────────────────────────

  test("defaults permit2Address to _contracts.permit2", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithPermit2")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ permit2Address: PERMIT2_ADDRESS })
    );
  });

  test("uses the provided permit2Address override", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithPermit2")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE,
      { permit2Address: PERMIT2_OVERRIDE }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ permit2Address: PERMIT2_OVERRIDE })
    );
  });

  test("throws when neither config nor override supplies permit2Address", async () => {
    await expect(
      makeCoreSDKForPermit2({ withPermit2: false }).signReceiveWithPermit2(
        EXCHANGE_TOKEN,
        VALUE,
        DEADLINE
      )
    ).rejects.toThrow(/Permit2 contract address not configured/);
  });

  test("defaults spender to protocolDiamond when not provided", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithPermit2")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: PROTOCOL_DIAMOND })
    );
  });

  test("uses the provided spender override", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithPermit2")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE,
      { spender: CUSTOM_SPENDER }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: CUSTOM_SPENDER })
    );
  });

  test("forwards permit2Nonce when supplied", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithPermit2")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit2().signReceiveWithPermit2(
      EXCHANGE_TOKEN,
      VALUE,
      DEADLINE,
      { permit2Nonce: PERMIT2_NONCE }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ permit2Nonce: PERMIT2_NONCE })
    );
  });
});

// ─── DAI permit mixin tests ───────────────────────────────────────────────────

const EXPIRY = MaxUint256.toString();
const DAI_TOKEN_DOMAIN = { name: "Dai Stablecoin" };

describe("ERC20Mixin#signReceiveWithDaiPermit()", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns a TransferAuthorization tagged DAIPermit when overrides is omitted", async () => {
    const result = await makeCoreSDKForPermit().signReceiveWithDaiPermit(
      EXCHANGE_TOKEN,
      DAI_TOKEN_DOMAIN,
      VALUE,
      EXPIRY
    );
    expect(result.strategy).toBe("DAIPermit");
    expect(result.data.expiry).toBe(EXPIRY);
  });

  test("returns StructuredData when returnTypedDataToSign: true", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (
      makeCoreSDKForPermit().signReceiveWithDaiPermit as any
    )(EXCHANGE_TOKEN, DAI_TOKEN_DOMAIN, VALUE, EXPIRY, {
      returnTypedDataToSign: true
    });
    const data = result as StructuredData;
    expect(data.primaryType).toBe("Permit");
    expect(data.domain.verifyingContract).toBe(EXCHANGE_TOKEN);
    expect(data.domain.name).toBe(DAI_TOKEN_DOMAIN.name);
    expect((data.domain as { version?: string }).version).toBe("1");
    expect(data.message.holder).toBe(SIGNER);
    expect(data.message.spender).toBe(PROTOCOL_DIAMOND);
    expect(data.message.allowed).toBe(true);
  });

  test("defaults spender to protocolDiamond when not provided", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithDaiPermit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithDaiPermit(
      EXCHANGE_TOKEN,
      DAI_TOKEN_DOMAIN,
      VALUE,
      EXPIRY
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: PROTOCOL_DIAMOND })
    );
  });

  test("uses the provided spender override", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithDaiPermit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithDaiPermit(
      EXCHANGE_TOKEN,
      DAI_TOKEN_DOMAIN,
      VALUE,
      EXPIRY,
      { spender: CUSTOM_SPENDER }
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ spender: CUSTOM_SPENDER })
    );
  });

  test("forwards tokenDomain and expiry to the handler", async () => {
    const spy = jest
      .spyOn(erc20Handler, "signReceiveWithDaiPermit")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({} as any);

    await makeCoreSDKForPermit().signReceiveWithDaiPermit(
      EXCHANGE_TOKEN,
      DAI_TOKEN_DOMAIN,
      VALUE,
      EXPIRY
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenDomain: DAI_TOKEN_DOMAIN,
        expiry: EXPIRY,
        exchangeToken: EXCHANGE_TOKEN,
        value: VALUE,
        chainId: CHAIN_ID,
        user: SIGNER
      })
    );
  });
});
