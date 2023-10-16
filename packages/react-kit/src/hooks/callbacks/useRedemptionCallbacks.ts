import { providers } from "ethers";
import { FormType as RedeemFormType } from "../../components/modal/components/Redeem/RedeemFormModel";
import { useRedemptionContext } from "../../components/widgets/redemption/provider/RedemptionContext";

export type RedemptionInfo = {
  exchangeId: string;
  offerId: string;
  buyerId: string;
  sellerId: string;
  sellerAddress: string;
  buyerAddress: string;
};

export type DeliveryInfoMessage = RedemptionInfo & {
  deliveryDetails: RedeemFormType;
};

export type RedeemTransactionMessage = {
  isError: boolean;
  error?: {
    name: string;
    message: string;
  };
  redemptionInfo: RedemptionInfo;
};

export type RedeemTransactionSubmittedMessage = RedeemTransactionMessage & {
  redeemTx?: {
    hash: string;
  };
};

export type RedeemTransactionConfirmedMessage = RedeemTransactionMessage & {
  redeemTx?: {
    hash: string;
    blockNumber: number;
  };
};

export type DeliveryInfoCallbackResponse = {
  accepted: boolean;
  reason: string;
  resume: boolean;
};

function postDeliveryInfoCallback(
  postDeliveryInfoUrl: string,
  postDeliveryInfoHeaders: { [key: string]: string } | undefined
) {
  return async (
    message: DeliveryInfoMessage,
    signer: providers.JsonRpcSigner | undefined
  ): Promise<DeliveryInfoCallbackResponse> => {
    if (!postDeliveryInfoUrl) {
      throw new Error(
        "[postDeliveryInfoCallback] postDeliveryInfoUrl is not defined"
      );
    }
    // add wallet signature in the message (must be verifiable by the backend)
    const signature = signer
      ? await signer.signMessage(JSON.stringify(message))
      : undefined;
    try {
      const response = await fetch(postDeliveryInfoUrl, {
        method: "POST",
        body: JSON.stringify({
          message,
          signature
        }),
        headers: {
          "content-type": "application/json;charset=UTF-8",
          ...postDeliveryInfoHeaders
        }
      });
      const isTrueOrOkOrYes = (s: string) =>
        !!s && ["true", "ok", "yes"].includes(s.toLowerCase());
      let responseBody;
      try {
        responseBody = await response.json();
      } catch {}
      const accepted =
        response.ok && isTrueOrOkOrYes(responseBody?.accepted?.toString());
      const resume =
        accepted && isTrueOrOkOrYes(responseBody?.resume?.toString());
      const reason = accepted
        ? ""
        : responseBody?.reason?.toString() || response.statusText;
      return {
        accepted,
        resume,
        reason
      };
    } catch (error) {
      return {
        accepted: false,
        reason: (error as Error).toString(),
        resume: false
      };
    }
  };
}

function postRedemptionSubmittedCallback(
  postRedemptionSubmittedUrl: string,
  postRedemptionSubmittedHeaders: { [key: string]: string } | undefined
) {
  return async (message: RedeemTransactionSubmittedMessage) => {
    if (!postRedemptionSubmittedUrl) {
      throw new Error(
        "[postRedemptionSubmittedCallback] postRedemptionSubmittedUrl is not defined"
      );
    }
    // TODO: get response from server and throw exception in case of an error
    await fetch(postRedemptionSubmittedUrl, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...postRedemptionSubmittedHeaders
      }
    });
  };
}

function postRedemptionConfirmedCallback(
  postRedemptionConfirmedUrl: string,
  postRedemptionConfirmedHeaders: { [key: string]: string } | undefined
) {
  return async (message: RedeemTransactionConfirmedMessage) => {
    if (!postRedemptionConfirmedUrl) {
      throw new Error(
        "[postDeliveryInfoCallback] postDeliveryInfoUrl is not defined"
      );
    }
    // TODO: get response from server and throw exception in case of an error
    await fetch(postRedemptionConfirmedUrl, {
      method: "POST",
      body: JSON.stringify(message),
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...postRedemptionConfirmedHeaders
      }
    });
  };
}

export function useRedemptionCallbacks() {
  const {
    postDeliveryInfoUrl,
    postDeliveryInfoHeaders,
    postRedemptionSubmittedUrl,
    postRedemptionSubmittedHeaders,
    postRedemptionConfirmedUrl,
    postRedemptionConfirmedHeaders
  } = useRedemptionContext();
  return {
    postDeliveryInfo: postDeliveryInfoUrl
      ? postDeliveryInfoCallback(postDeliveryInfoUrl, postDeliveryInfoHeaders)
      : undefined,
    postRedemptionSubmitted: postRedemptionSubmittedUrl
      ? postRedemptionSubmittedCallback(
          postRedemptionSubmittedUrl,
          postRedemptionSubmittedHeaders
        )
      : undefined,
    postRedemptionConfirmed: postRedemptionConfirmedUrl
      ? postRedemptionConfirmedCallback(
          postRedemptionConfirmedUrl,
          postRedemptionConfirmedHeaders
        )
      : undefined
  };
}
