import { BigNumberish } from "ethers";
import { TransactionResponse, TransactionRequest } from "@bosonprotocol/common";
import { EthersAdapter, Provider } from "./ethers-adapter";

/**
 * `AgentAdapter` extension of EthersAdapter which also targets `ethers`.
 */
export class AgentAdapter extends EthersAdapter {
  private sentTransactions: TransactionRequest[] = [];
  constructor(
    provider: Provider,
    private signerInfo: { signerAddress: string; chainId: number }
  ) {
    super(provider, null);
  }

  public async getSignerAddress() {
    return this.signerInfo.signerAddress;
  }

  public async getChainId(): Promise<number> {
    return this.signerInfo.chainId;
  }

  public async estimateGas(
    transactionRequest: TransactionRequest
  ): Promise<BigNumberish> {
    // Use provider.estimateGas since we never have a signer
    // Ensure 'from' is set for accurate gas estimation
    const requestWithFrom = {
      ...transactionRequest,
      from: transactionRequest.from || this.signerInfo.signerAddress
    };

    return this._provider.estimateGas(requestWithFrom);
  }

  public getLastSentTransaction(): TransactionRequest | undefined {
    return this.sentTransactions.shift();
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    this.sentTransactions.push(transactionRequest);
    return;
  }

  public async send(rpcMethod: string, payload: unknown[]): Promise<string> {
    return this._provider.send(rpcMethod, payload);
  }
}
