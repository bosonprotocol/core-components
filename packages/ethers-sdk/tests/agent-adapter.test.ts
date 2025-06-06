import { AgentAdapter } from "../src/agent-adapter";
import { Provider } from "../src/ethers-adapter";
import { TransactionRequest } from "@bosonprotocol/common";

const WALLETS = [
  "0xaaaaaaaaaabbbbbbbbbbccccccccccdddddddddd",
  "0x0000000000111111111122222222223333333333",
  "0x4444444444555555555566666666667777777777"
];
const CHAIN_ID = 1234;
const BALANCE = "123456";
const BLOCK_NUMBER = "42";
const CALL_RET = "call_ret";
const GAS_USED = "87654";
const GAS_ESTIMATE = "21000";
const TX_HASH = "transactionHash";
const CONTRACT_CODE = "0x608060405234801561001057600080fd5b50";
const EOA_CODE = "0x";

const MOCK_TRANSACTION_REQUEST: TransactionRequest = {
  to: WALLETS[1],
  from: WALLETS[0],
  value: "1000000000000000000", // 1 ETH
  data: "0x",
  gasLimit: "21000"
};

test("imports AgentAdapter", () => {
  expect(AgentAdapter).toBeTruthy();
});

test("AgentAdapter constructor", () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);
  expect(agentAdapter).toBeTruthy();
});

test("AgentAdapter getSignerAddress returns signerInfo address", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[2], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const signerAddress = await agentAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[2]);
});

test("AgentAdapter getChainId returns signerInfo chainId", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: 5678 };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const chainId = await agentAdapter.getChainId();
  expect(chainId).toEqual(5678);
});

test("AgentAdapter isSignerContract detects EOA", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const isContract = await agentAdapter.isSignerContract();
  expect(isContract).toBe(false);
  expect(provider.getCode).toHaveBeenCalledWith(WALLETS[0]);
});

test("AgentAdapter isSignerContract detects contract", async () => {
  const provider = mockProviderWithContract();
  const signerInfo = { signerAddress: WALLETS[1], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const isContract = await agentAdapter.isSignerContract();
  expect(isContract).toBe(true);
  expect(provider.getCode).toHaveBeenCalledWith(WALLETS[1]);
});

test("AgentAdapter estimateGas uses provider with from address", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const gasEstimate = await agentAdapter.estimateGas(MOCK_TRANSACTION_REQUEST);

  expect(gasEstimate).toEqual(GAS_ESTIMATE);
  expect(provider.estimateGas).toHaveBeenCalledWith({
    ...MOCK_TRANSACTION_REQUEST,
    from: WALLETS[0] // Should use the from field from the request
  });
});

test("AgentAdapter estimateGas defaults from address when not provided", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[2], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const requestWithoutFrom = { ...MOCK_TRANSACTION_REQUEST };
  delete requestWithoutFrom.from;

  const gasEstimate = await agentAdapter.estimateGas(requestWithoutFrom);

  expect(gasEstimate).toEqual(GAS_ESTIMATE);
  expect(provider.estimateGas).toHaveBeenCalledWith({
    ...requestWithoutFrom,
    from: WALLETS[2] // Should default to signerInfo address
  });
});
test("AgentAdapter sendTransaction throws error", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  await expect(
    agentAdapter.sendTransaction(MOCK_TRANSACTION_REQUEST)
  ).rejects.toThrow(
    "sendTransaction is not supported in AgentAdapter. Use sendSignedTransaction instead."
  );
});

test("AgentAdapter call delegates to provider", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const result = await agentAdapter.call(MOCK_TRANSACTION_REQUEST);

  expect(result).toEqual(CALL_RET);
  expect(provider.call).toHaveBeenCalledWith(MOCK_TRANSACTION_REQUEST);
});

test("AgentAdapter send delegates to provider", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const rpcMethod = "eth_getBalance";
  const payload = [WALLETS[0], "latest"];

  const result = await agentAdapter.send(rpcMethod, payload);

  expect(result).toEqual(TX_HASH);
  expect(provider.send).toHaveBeenCalledWith(rpcMethod, payload);
});

test("AgentAdapter getTransactionReceipt delegates to provider", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const receipt = await agentAdapter.getTransactionReceipt(TX_HASH);

  expect(receipt.transactionHash).toEqual(TX_HASH);
  expect(receipt.status).toEqual(1);
  expect(provider.getTransactionReceipt).toHaveBeenCalledWith(TX_HASH);
});

test("AgentAdapter inherits uuid from parent", () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  expect(agentAdapter.uuid).toBeDefined();
  expect(typeof agentAdapter.uuid).toBe("string");
});

test("AgentAdapter multiple instances have different uuids", () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };

  const adapter1 = new AgentAdapter(provider, signerInfo);
  const adapter2 = new AgentAdapter(provider, signerInfo);

  expect(adapter1.uuid).not.toEqual(adapter2.uuid);
});

// Edge cases and error scenarios
test("AgentAdapter handles empty transaction request in estimateGas", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const emptyRequest = {};
  const gasEstimate = await agentAdapter.estimateGas(emptyRequest);

  expect(gasEstimate).toEqual(GAS_ESTIMATE);
  expect(provider.estimateGas).toHaveBeenCalledWith({
    from: WALLETS[0]
  });
});

test("AgentAdapter preserves all transaction request properties", async () => {
  const provider = mockProvider();
  const signerInfo = { signerAddress: WALLETS[0], chainId: CHAIN_ID };
  const agentAdapter = new AgentAdapter(provider, signerInfo);

  const complexRequest = {
    to: WALLETS[1],
    from: WALLETS[2],
    value: "2000000000000000000",
    data: "0x1234567890abcdef",
    gasLimit: "50000",
    gasPrice: "20000000000",
    nonce: 42
  };

  await agentAdapter.estimateGas(complexRequest);

  expect(provider.estimateGas).toHaveBeenCalledWith(complexRequest);
});

function mockProvider(): Provider {
  const provider = {
    getBalance: jest.fn().mockResolvedValue({ toString: () => BALANCE }),
    call: jest.fn().mockResolvedValue(CALL_RET),
    getTransactionReceipt: jest.fn().mockResolvedValue({
      status: 1,
      transactionHash: TX_HASH,
      logs: [{ data: "data", topics: "topics" }],
      gasUsed: GAS_USED,
      blockNumber: BLOCK_NUMBER,
      from: WALLETS[0],
      to: WALLETS[1],
      effectiveGasPrice: "20000000000"
    }),
    send: jest.fn().mockResolvedValue(TX_HASH),
    getSigner: jest.fn().mockReturnValue({
      getAddress: jest.fn().mockResolvedValue(WALLETS[0]),
      getChainId: jest.fn().mockResolvedValue(CHAIN_ID),
      connect: jest.fn().mockReturnThis()
    }),
    getCode: jest.fn().mockResolvedValue(EOA_CODE),
    estimateGas: jest.fn().mockResolvedValue(GAS_ESTIMATE)
  } as unknown as Provider;

  return provider;
}

function mockProviderWithContract(): Provider {
  const provider = mockProvider();
  (provider.getCode as jest.Mock).mockResolvedValue(CONTRACT_CODE);
  return provider;
}
