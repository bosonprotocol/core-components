import { BigNumberish, ethers } from "ethers";
import {
  TransactionResponse,
  Web3LibAdapter,
  TransactionRequest
} from "@bosonprotocol/common";
import { IBosonOfferHandler__factory } from "./contracts/factories/IBosonOfferHandler__factory";
import { BosonTypes } from "./contracts/IBosonOfferHandler";

export type EthersAdapterConstructorArgs = {
  signer: ethers.Signer;
};

export class EthersAdapter implements Web3LibAdapter {
  private _signer: ethers.Signer;

  constructor({ signer }: EthersAdapterConstructorArgs) {
    this._signer = signer;
  }

  public async getBalance(address: string): Promise<BigNumberish> {
    return this._signer.getBalance();
  }

  public async sendTransaction(
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> {
    return this._signer.sendTransaction(transactionRequest);
  }

  public async getOffer(
    offerId: BigNumberish
  ): Promise<BosonTypes.OfferStruct> {
    const bosonOfferHandler = IBosonOfferHandler__factory.connect(
      "0x",
      this._signer
    );
    const [success, offer] = await bosonOfferHandler.getOffer(offerId);

    if (!success) {
      return null;
    }

    return offer;
  }
}
