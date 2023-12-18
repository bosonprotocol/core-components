import { getSubgraphBlockNumber, waitForGraphNodeIndexing } from "./utils";
import {
  TransactionResponse,
  TransactionReceipt
} from "../../packages/common/src/index";

jest.setTimeout(60_000);

describe("subgraph meta", () => {
  test("get block number", async () => {
    const blockNumber = await getSubgraphBlockNumber();
    expect(blockNumber).toBeGreaterThan(0);
  });
  test("wait for a given blockNumber", async () => {
    let currentBlock = await getSubgraphBlockNumber();
    const target = currentBlock + 2;
    await waitForGraphNodeIndexing(target);
    currentBlock = await getSubgraphBlockNumber();
    expect(currentBlock).toBeGreaterThanOrEqual(target);
  });
  test("wait for a given transaction response", async () => {
    let currentBlock = await getSubgraphBlockNumber();
    const target = currentBlock + 2;
    const txResponse = {
      wait: async () => {
        return new Promise<{ blockNumber: number }>((resolve) => {
          setTimeout(() => {
            resolve({ blockNumber: target });
          }, 1000);
        });
      }
    } as TransactionResponse;
    await waitForGraphNodeIndexing(txResponse);
    currentBlock = await getSubgraphBlockNumber();
    expect(currentBlock).toBeGreaterThanOrEqual(target);
  });
  test("wait for a given transaction receipt", async () => {
    let currentBlock = await getSubgraphBlockNumber();
    const target = currentBlock + 2;
    const txReceipt = {
      blockNumber: target
    } as TransactionReceipt;
    await waitForGraphNodeIndexing(txReceipt);
    currentBlock = await getSubgraphBlockNumber();
    expect(currentBlock).toBeGreaterThanOrEqual(target);
  });
});
