import { RequestManager } from "eth-connect";
import { EthConnectAdapter } from "../src/index";
import { ExternalFeatures } from "../src/eth-connect-adapter";

const WALLETS = [
  "0xaaaaaaaaaabbbbbbbbbbccccccccccdddddddddd",
  "0x0000000000111111111122222222223333333333",
  "0x4444444444555555555566666666667777777777"
];
const CHAIN_ID = 1234;
const BALANCE = "123456";
const BLOCK_NUMBER = "42";
const CALL_RET = "call_ret";
const TRANSACTION_COUNT = 64;
const GAS_USED = "87654";
const TX_HASH = "transactionHash";

test("imports EthConnectAdapter", () => {
  expect(EthConnectAdapter).toBeTruthy();
});

test("EthConnectAdapter constructor", () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures(WALLETS[1]);
  const signer = mockSigner(WALLETS[2]);
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures, signer);
  expect(ethConnectAdapter).toBeTruthy();
});

test("EthConnectAdapter getSignerAddress without signer without ExternalFeatures", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  expect(ethConnectAdapter).toBeTruthy();
  const signerAddress = await ethConnectAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[0]);
});

test("EthConnectAdapter getSignerAddress with signer without ExternalFeatures", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const signer = mockSigner(WALLETS[2]);
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures, signer);
  expect(ethConnectAdapter).toBeTruthy();
  const signerAddress = await ethConnectAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[2]);
});

test("EthConnectAdapter getSignerAddress without signer with ExternalFeatures", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures(WALLETS[1]);
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  expect(ethConnectAdapter).toBeTruthy();
  const signerAddress = await ethConnectAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[1]);
});

test("EthConnectAdapter getSignerAddress with signer with ExternalFeatures", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures(WALLETS[1]);
  const signer = mockSigner(WALLETS[2]);
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  expect(ethConnectAdapter).toBeTruthy();
  const signerAddress = await ethConnectAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[1]);
});

test("EthConnectAdapter isSignerContract", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const isSignerContract = await ethConnectAdapter.isSignerContract();
  expect(isSignerContract).toEqual(false);
});

test("EthConnectAdapter getChainId", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const chainId = await ethConnectAdapter.getChainId();
  expect(chainId).toEqual(CHAIN_ID);
});

test("EthConnectAdapter getBalance", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const balance = await ethConnectAdapter.getBalance("anyWallet");
  expect(balance).toEqual(BALANCE);
});

test("EthConnectAdapter sendTransaction", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const txResponse = await ethConnectAdapter.sendTransaction({});
  expect(txResponse.hash).toEqual(TX_HASH);
  const txReceipt = await txResponse.wait();
  expect(txReceipt.transactionHash).toEqual(TX_HASH);
});

test("EthConnectAdapter call", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const callRet = await ethConnectAdapter.call({});
  expect(callRet).toEqual(CALL_RET);
});

test("EthConnectAdapter send", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const txHash = await ethConnectAdapter.send("rpcMethod", []);
  expect(txHash).toEqual(TX_HASH);
});

test("EthConnectAdapter getTransactionReceipt", async () => {
  const requestManager = mockRequestManager();
  const externalFeatures = mockExternalFeatures();
  const ethConnectAdapter = new EthConnectAdapter(requestManager, externalFeatures);
  const txReceipt = await ethConnectAdapter.getTransactionReceipt(TX_HASH);
  expect(txReceipt.transactionHash).toEqual(TX_HASH);
});

function mockSigner(wallet: string): RequestManager {
  return mockRequestManager(wallet);
}

function mockRequestManager(wallet?: string): RequestManager {
  return {
    net_version: async () => CHAIN_ID,
    eth_getBalance: async () => { return { toString: () => BALANCE }; },
    eth_blockNumber: async () => { return { toString: () => BLOCK_NUMBER }; },
    eth_call: async () => CALL_RET,
    eth_getTransactionCount: async () => TRANSACTION_COUNT,
    eth_getTransactionReceipt: async (txHash: string) => {
      return {
        status: 1, // 0 means failure
        transactionHash: TX_HASH,
        logs: [{ data: "data", topics: "topics" }],
        gasUsed: GAS_USED,
        blockNumber: BLOCK_NUMBER
      };
    },
    eth_accounts: async () => wallet ? [wallet] : WALLETS,
    eth_sendTransaction: async (t: any) => TX_HASH,
    sendAsync: async (t: any) => TX_HASH
  } as unknown as RequestManager;
}

function mockExternalFeatures(signerAddress?: string): ExternalFeatures {
  if (signerAddress) {
    return {
      delay: async (ms: number) => undefined,
      getSignerAddress: async () => {
        return signerAddress;
      }
    } as ExternalFeatures;  
  }
  return {
    delay: async (ms: number) => undefined
  } as ExternalFeatures;
}
