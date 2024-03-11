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

test("imports EthersAdapter", () => {
  expect(EthersAdapter).toBeTruthy();
});

test("EthersAdapter constructor", () => {
  const provider = mockProvider();
  const signer = mockSigner(WALLETS[2]);
  const ethersAdapter = new EthersAdapter(provider, signer);
  expect(ethersAdapter).toBeTruthy();
});

test("EthConnectAdapter getSignerAddress without signer", async () => {
  const provider = mockProvider();
  const ethersAdapter = new EthersAdapter(provider);
  expect(ethersAdapter).toBeTruthy();
  const signerAddress = await ethersAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[0]);
});

test("EthConnectAdapter getSignerAddress with signer", async () => {
  const provider = mockProvider();
  const signer = mockSigner(WALLETS[2]);
  const ethersAdapter = new EthersAdapter(provider, signer);
  expect(ethersAdapter).toBeTruthy();
  const signerAddress = await ethersAdapter.getSignerAddress();
  expect(signerAddress).toEqual(WALLETS[2]);
});


function mockProvider(): Provider {
  return {
    getBalance: async () => {
      return { toString: () => BALANCE };
    },
    call: async () => CALL_RET,
    getTransactionReceipt: async (txHash: string) => {
      return {
        status: 1, // 0 means failure
        transactionHash: TX_HASH,
        logs: [{ data: "data", topics: "topics" }],
        gasUsed: GAS_USED,
        blockNumber: BLOCK_NUMBER
      };
    },
    send: async (t: any) => TX_HASH,
    getSigner: () => mockSigner(WALLETS[0]),
    getCode: async (address: string) => "0x"
  } as unknown as Provider;
}

function mockSigner(wallet: string): Signer {
  const signer = {
    getAddress: async () => wallet,
    getChainId: async () => CHAIN_ID
  };
  return {
    ...signer,
    connect: () => signer
  } as unknown as Signer;
}
