import fetch from "cross-fetch";

import { ApiError } from "../utils/errors";

export type RelayTransactionResponse = {
  txHash: string;
  log: string;
  retryDuration: number;
  flag: number;
};

export type RelayTransactionArgs = {
  to: string;
  params: unknown[];
  from: string;
  signatureType?: string;
};

export type RelayOverrides = {
  relayerUrl: string;
  apiKey: string;
  apiId: string;
};

export type GetRetriedHashesData = {
  oldHash: string;
  newHash: string;
  oldGasPrice: string;
  newGasPrice: string;
  timestamp: number;
  retryCount: number;
  relayerAddress: string;
  newStatus: string;
};

export type GetRetriedHashesResponse = {
  code: number;
  message: string;
  data: GetRetriedHashesData;
};

export type GetRetriedHashesArgs = {
  networkId: number;
  transactionHash: string;
};

export type ForwarderDomainData = {
  name: string;
  version: string;
  verifyingContract: string;
  salt: string;
};

async function _fetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let retry = 3;
  let err;
  while (retry--) {
    try {
      const res = await fetch(input, init);
      const clonedRes = res.clone();
      return clonedRes;
    } catch (error) {
      err = error;
    }
  }
  throw err;
}

export class Biconomy {
  public constructor(
    private _relayerUrl: string,
    private _apiKey?: string,
    private _apiId?: string
  ) {}

  public async getForwarderDomainDetails(
    args: { chainId: number },
    overrides: Partial<{
      relayerUrl: string;
      forwarderAddress: string;
    }> = {}
  ): Promise<{ [key: string]: ForwarderDomainData }> {
    const url = `${
      overrides.relayerUrl || this._relayerUrl
    }/api/v2/meta-tx/systemInfo?networkId=${args.chainId}`;
    const response = await _fetch(url, { method: "GET" });

    if (!response.ok) {
      let message;
      try {
        const jsonResponse = await response.json();
        message = JSON.stringify(jsonResponse);
      } catch {
        message = response.statusText;
      }
      throw new ApiError(response.status, `Failed to relay tx: ${message}`);
    }
    const txResponse = await response.json();
    return txResponse?.forwarderDomainDetails;
  }

  public async relayTransaction(
    args: RelayTransactionArgs,
    overrides: Partial<RelayOverrides> = {}
  ): Promise<RelayTransactionResponse> {
    const url = `${
      overrides.relayerUrl || this._relayerUrl
    }/api/v2/meta-tx/native`;
    const response = await _fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": overrides.apiKey || this._apiKey,
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        ...args,
        apiId: overrides.apiId || this._apiId
      })
    });

    if (!response.ok) {
      let message;
      try {
        const jsonResponse = await response.json();
        message = JSON.stringify(jsonResponse);
      } catch {
        message = response.statusText;
      }
      throw new ApiError(response.status, `Failed to relay tx: ${message}`);
    }

    const txResponse = (await response.json()) as RelayTransactionResponse;
    if (!txResponse.txHash) {
      throw new ApiError(
        txResponse.flag || (txResponse as any).code,
        txResponse.log || (txResponse as any).message
      );
    }
    return txResponse;
  }

  public async getResubmitted(
    args: GetRetriedHashesArgs,
    overrides: Partial<RelayOverrides> = {}
  ): Promise<GetRetriedHashesResponse> {
    const url = `${
      overrides.relayerUrl || this._relayerUrl
    }/api/v1/meta-tx/resubmitted?networkId=${args.networkId}&transactionHash=${
      args.transactionHash
    }`;
    const response = await _fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to get resubmitted tx: ${response.statusText}`
      );
    }

    return response.json() as Promise<GetRetriedHashesResponse>;
  }

  public async wait(
    args: GetRetriedHashesArgs,
    overrides: Partial<RelayOverrides> = {}
  ): Promise<GetRetriedHashesResponse> {
    let pending = true;
    let resubmittedResponse: GetRetriedHashesResponse;

    while (pending) {
      resubmittedResponse = await this.getResubmitted(args, overrides);

      pending = resubmittedResponse.data.newStatus === "PENDING";
      if (pending) {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      }
    }
    return resubmittedResponse;
  }

  public async check(
    args: {
      contract?: string;
    } = {}
  ): Promise<boolean> {
    const url = `${
      this._relayerUrl
    }/ready?apiKey=${this._apiKey || ""}&apiId=${this._apiId || ""}&contract=${args.contract || ""}`;
    try {
      const response = await _fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
      if (!response.ok) {
        return false;
      }
      const json = (await response.json()) as { ready: boolean };
      return json?.ready || false;
    } catch (e) {
      return false;
    }
  }
}
