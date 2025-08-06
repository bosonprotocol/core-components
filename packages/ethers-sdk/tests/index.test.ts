import { Signer } from "ethers";
import { EthersAdapter, Provider } from "../src/index";

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
const TX_HASH = "transactionHash";
const nowInSec = Math.floor(Date.now() / 1000);

test("imports EthersAdapter", () => {
  expect(EthersAdapter).toBeTruthy();
});

test("EthersAdapter constructor", () => {
  const provider = mockProvider();
  const signer = mockSigner(WALLETS[2]);
  const ethersAdapter = new EthersAdapter(provider, signer);
  expect(ethersAdapter).toBeTruthy();
});

test("EthersAdapter getSignerAddress without signer", async () => {
  const provider = mockProvider();
  const ethersAdapter = new EthersAdapter(provider);
  expect(ethersAdapter).toBeTruthy();
  const signerAddress = await ethersAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[0]);
});

test("EthersAdapter getSignerAddress with signer", async () => {
  const provider = mockProvider();
  const signer = mockSigner(WALLETS[2]);
  const ethersAdapter = new EthersAdapter(provider, signer);
  expect(ethersAdapter).toBeTruthy();
  const signerAddress = await ethersAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[2]);
});

test("EthersAdapter getCurrentTimeMs", async () => {
  const provider = mockProvider();
  const ethersAdapter = new EthersAdapter(provider);
  expect(ethersAdapter).toBeTruthy();
  const nowMs = await ethersAdapter.getCurrentTimeMs();
  expect(nowMs).toBe(nowInSec * 1000); // Convert seconds to milliseconds
});

function mockProvider(): Provider {
  return {
    getBalance: async () => {
      return { toString: () => BALANCE };
    },
    call: async () => CALL_RET,
    getTransactionReceipt: async () => {
      return {
        status: 1, // 0 means failure
        transactionHash: TX_HASH,
        logs: [{ data: "data", topics: "topics" }],
        gasUsed: GAS_USED,
        blockNumber: BLOCK_NUMBER
      };
    },
    send: async () => TX_HASH,
    getSigner: () => mockSigner(WALLETS[0]),
    getCode: async () => "0x",
    getBlock: async () => ({ timestamp: nowInSec })
  } as unknown as Provider;
}

function mockSigner(wallet: string): Signer {
  const signer = {
    getAddress: async () => wallet,
    getChainId: async () => CHAIN_ID
  };
  return { ...signer, connect: () => signer } as unknown as Signer;
}
