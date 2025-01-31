import { GraphQLClient, gql } from "graphql-request";
import { TransactionReceipt, TransactionResponse } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

const DELAYS_PER_CHAINID: {
  [key: number]: {
    BLOCK_DELAY: number;
    MAX_SAME_BLOCK: number;
    MAX_SAME_BLOCK_DELAY: number;
    DEFAULT_TIMEOUT: number;
  };
} = {
  1: {
    BLOCK_DELAY: 12000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 30000,
    DEFAULT_TIMEOUT: 60000
  },
  137: {
    BLOCK_DELAY: 1000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 5000,
    DEFAULT_TIMEOUT: 30000
  },
  80002: {
    BLOCK_DELAY: 1000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 5000,
    DEFAULT_TIMEOUT: 30000
  },
  8453: {
    BLOCK_DELAY: 1000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 5000,
    DEFAULT_TIMEOUT: 30000
  },
  84532: {
    BLOCK_DELAY: 1000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 5000,
    DEFAULT_TIMEOUT: 30000
  },
  11155111: {
    BLOCK_DELAY: 12000,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 30000,
    DEFAULT_TIMEOUT: 60000
  },
  31337: {
    BLOCK_DELAY: 200,
    MAX_SAME_BLOCK: 20,
    MAX_SAME_BLOCK_DELAY: 1000,
    DEFAULT_TIMEOUT: 3000
  }
};

export class SubgraphMixin extends BaseCoreSDK {
  public async waitForGraphNodeIndexing(
    blockNumberOrTransaction?: number | TransactionResponse | TransactionReceipt
  ) {
    const delays = DELAYS_PER_CHAINID[this._chainId];
    let blockToWaitFor = 0;
    if (typeof blockNumberOrTransaction === "number") {
      blockToWaitFor = blockNumberOrTransaction;
    } else if (blockNumberOrTransaction?.["blockNumber"]) {
      blockToWaitFor = (blockNumberOrTransaction as TransactionReceipt)
        .blockNumber;
    } else if (blockNumberOrTransaction?.["wait"]) {
      const txReceipt = await (
        blockNumberOrTransaction as TransactionResponse
      ).wait();
      blockToWaitFor = txReceipt.blockNumber;
    }
    if (blockToWaitFor > 0) {
      let currentBlock = await this.getSubgraphBlockNumber();
      let oldCurrentBlock = currentBlock;
      let sameBlockNumber = 0;
      while (currentBlock < blockToWaitFor) {
        await this.wait(delays.BLOCK_DELAY);
        currentBlock = await this.getSubgraphBlockNumber();
        if (currentBlock === oldCurrentBlock) {
          if (sameBlockNumber++ >= delays.MAX_SAME_BLOCK) {
            // Seems that the subgraph does not update its current block
            console.error(
              `Seems that the subgraph does not update its current block after ${currentBlock}`
            );
            await this.wait(delays.MAX_SAME_BLOCK_DELAY);
            return;
          }
        }
        oldCurrentBlock = currentBlock;
      }
      return;
    }
    await this.wait(delays.DEFAULT_TIMEOUT);
  }

  public async getSubgraphBlockNumber(): Promise<number> {
    const client = new GraphQLClient(this._subgraphUrl);
    const response = await client.request<{
      _meta?: { block?: { number?: number } };
    }>(gql`
      query MyQuery {
        _meta {
          block {
            number
          }
        }
      }
    `);
    return response?._meta?.block?.number || 0;
  }

  protected async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
