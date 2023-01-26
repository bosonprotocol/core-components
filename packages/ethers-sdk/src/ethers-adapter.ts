import { BigNumberish, providers, Signer } from "ethers";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest,
  TransactionReceipt
} from "@bosonprotocol/common";

export type Provider =
  | providers.UrlJsonRpcProvider
  | providers.AlchemyProvider
  | providers.AlchemyWebSocketProvider
  | providers.AnkrProvider
  | providers.CloudflareProvider
  | providers.InfuraProvider
  | providers.InfuraWebSocketProvider
  | providers.JsonRpcProvider
  | providers.JsonRpcBatchProvider
  | providers.NodesmithProvider
  | providers.PocketProvider
  | providers.StaticJsonRpcProvider
  | providers.Web3Provider
  | providers.WebSocketProvider
  | providers.IpcProvider;

/**
 * `Web3LibAdapter` implementation targeting `ethers`.
 */
export class EthersAdapter implements Web3LibAdapter {
  private _signer: Signer;
  private _provider: Provider;

  constructor(provider: Provider, signer?: Signer) {
    this._provider = provider;

    this._signer = signer
      ? signer.connect(this._provider)
      : this._provider.getSigner();
  }

  public getProvider() {
    return this._provider;
  }

  public async getSignerAddress() {
    return this._signer.getAddress();
  }

  public async getChainId(): Promise<number> {
    return this._signer.getChainId();
  }

  public async getBalance(
    addressOrName: string,
    blockNumber?: string | number
  ): Promise<BigNumberish> {
    return this._provider.getBalance(addressOrName, blockNumber);
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    return this._signer.sendTransaction(transactionRequest);
  }

  public async call(transactionRequest: TransactionRequest): Promise<string> {
    return this._provider.call(transactionRequest);
  }

  public async send(rpcMethod: string, payload: unknown[]): Promise<string> {
    if (
      this._signer &&
      "_signTypedData" in this._signer &&
      rpcMethod === "eth_signTypedData_v4"
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [signerAddress, dataToSign] = payload as [string, string];
      const { types, domain, message: value } = JSON.parse(dataToSign);
      delete types["EIP712Domain"];
      return this._signer["_signTypedData"](domain, types, value);
    }
    return this._provider.send(rpcMethod, payload);
  }

  public async getTransactionReceipt(txHash): Promise<TransactionReceipt> {
    return this._provider.getTransactionReceipt(txHash);
  }
}
