import { GraphQLClient, gql } from "graphql-request";
import { TransactionReceipt, TransactionResponse } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class SubgraphMixin extends BaseCoreSDK {
  public async waitForGraphNodeIndexing(
    blockNumberOrTransaction?: number | TransactionResponse | TransactionReceipt
  ) {
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
      const MAX_SAME_BLOCK = 20;
      while (currentBlock < blockToWaitFor) {
        console.log(
          `Wait for subgraph indexing (${currentBlock}/${blockToWaitFor})`
        );
        await this.wait(1_000);
        currentBlock = await this.getSubgraphBlockNumber();
        if (currentBlock === oldCurrentBlock) {
          if (sameBlockNumber++ >= MAX_SAME_BLOCK) {
            // Seems that the subgraph does not update its current block
            console.error(
              `Seems that the subgraph does not update its current block after ${currentBlock}`
            );
            await this.wait(5_000);
            return;
          }
        }
        oldCurrentBlock = currentBlock;
      }
      return;
    }
    await this.wait(30_000);
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
