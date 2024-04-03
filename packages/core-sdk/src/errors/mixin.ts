import { Interface } from "@ethersproject/abi";
import { abis, ErrorFragment } from "@bosonprotocol/common";
import { BaseCoreSDK } from "./../mixins/base-core-sdk";

export class ErrorMixin extends BaseCoreSDK {
  public parseError(error: object): object {
    return { ...error, decoded: this.recurseParseError(error) };
  }

  private recurseParseError(error: object): string | undefined {
    if (this.isValidError(error)) {
      return this.decodeError(error["data"]);
    }
    if (error["error"]) {
      return this.recurseParseError(error["error"]);
    }
    return undefined;
  }

  private isValidError(error: object): boolean {
    return error["data"] && /^0x[0-9a-fA-F]{8}$/.test(error["data"]);
  }

  private decodeError(data: string): string | undefined {
    this.parseAbis();
    const error = this._errorsMap.get(data.toLowerCase());
    return error?.name;
  }

  private parseAbis() {
    if (this._errorsMap.size === 0) {
      Object.keys(abis).forEach((abi) => {
        const iface = new Interface(abis[abi]);
        Object.keys(iface.errors).forEach((error) => {
          const sigHash = iface.getSighash(error);
          this._errorsMap.set(
            sigHash.toLowerCase(),
            iface.errors[error] as ErrorFragment
          );
        });
      });
    }
  }
}
