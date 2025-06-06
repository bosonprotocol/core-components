import { BaseCoreSDK } from "../mixins/base-core-sdk";
import { handler } from ".";
import { Web3LibAdapter } from "@bosonprotocol/common";

export class ProtocolConfigMixin<
  T extends Web3LibAdapter
> extends BaseCoreSDK<T> {
  public async getMaxRoyaltyPercentage(
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<number> {
    return handler.getMaxRoyaltyPercentage({
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib
    });
  }
}
