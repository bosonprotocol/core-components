import fetch from "cross-fetch";

export type RelayTransactionResponse = {
  txHash: string;
  log: string;
  retryDuration: number;
  flag: number;
};

export type RelayTransactionArgs = {
  to: string;
  apiId: string;
  params: unknown[];
  from: string;
};

export type GetRetriedHashesResponse = {
  code: number;
  message: string;
  data: {
    oldHash: string;
    newHash: string;
    oldGasPrice: string;
    newGasPrice: string;
    timestamp: number;
    retryCount: number;
    relayerAddress: string;
    newStatus: string;
  };
  events?: unknown[];
};

export type GetRetriedHashesArgs = {
  networkId: number;
  transactionHash: string;
};

export class Biconomy {
  public constructor(private _relayerUrl: string, private _apiKey: string) {}

  public async relayTransaction(
    args: RelayTransactionArgs
  ): Promise<RelayTransactionResponse> {
    const url = `${this._relayerUrl}/api/v2/meta-tx/native`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": this._apiKey,
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(args)
    });
    const responseJSON = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failure to relay the metaTransaction: ${JSON.stringify(
          responseJSON || response
        )}`
      );
    }
    return {
      ...responseJSON
    };
  }

  public async getRetriedHashes(
    args: GetRetriedHashesArgs
  ): Promise<GetRetriedHashesResponse> {
    let pending = true;
    let responseJSON;
    while (pending) {
      const url = `${this._relayerUrl}/api/v1/meta-tx/resubmitted?networkId=${args.networkId}&transactionHash=${args.transactionHash}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
      responseJSON = await response.json();
      if (!response.ok || response.status !== 200) {
        throw new Error(
          `Failure to relay the metaTransaction: ${JSON.stringify(
            responseJSON || response
          )}`
        );
      }
      // TODO: check responseJSON.data.newStatus. While == "PENDING" keep waiting
      pending = responseJSON.data.newStatus === "PENDING";
      if (pending) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      }
    }
    return {
      ...responseJSON
    };
  }
}
