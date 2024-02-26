import { BaseCoreSDK } from "../mixins/base-core-sdk";
import { handler } from ".";

export class ProtocolConfigMixin extends BaseCoreSDK {
  public async getMaxRoyaltyPercentage(
    overrides: Partial<{
      contractAddress: string;
    }> = {}
  ): Promise<number> {
    return handler.getMaxRoyaltyPercentage({
      contractAddress: overrides.contractAddress || this._protocolDiamond,
      web3Lib: this._web3Lib,
    });
  }
}
