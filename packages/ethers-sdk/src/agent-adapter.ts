import { BigNumberish } from "ethers";
import { TransactionResponse, TransactionRequest } from "@bosonprotocol/common";
import { EthersAdapter, Provider } from "./ethers-adapter";

/**
 * `AgentAdapter` extension of EthersAdapter which also targets `ethers`.
 */
export class AgentAdapter extends EthersAdapter {
  constructor(
    provider: Provider,
    private signerInfo: { signerAddress: string }
  ) {
    super(provider, null);
  }

  public async getSignerAddress() {
    return this.signerInfo.signerAddress;
  }

  public async getChainId(): Promise<number> {
    return (await this._provider.getNetwork()).chainId;
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

  public async sendTransaction(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    _transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    throw new Error(
      "sendTransaction is not supported in AgentAdapter. Use sendSignedTransaction instead."
    );
  }

  public async sendSignedTransaction(
    signedTransaction: string
  ): Promise<TransactionResponse> {
    return await this._provider.sendTransaction(signedTransaction);
  }
}
