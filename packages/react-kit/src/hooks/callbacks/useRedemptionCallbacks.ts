import { useRedemptionContext } from "../../components/widgets/redemption/provider/RedemptionContext";
import {
  DeliveryInfoCallbackResponse,
  DeliveryInfoMessage,
  RedeemTransactionConfirmedCallbackResponse,
  RedeemTransactionConfirmedMessage,
  RedeemTransactionSubmittedCallbackResponse,
  RedeemTransactionSubmittedMessage
} from "./types";

async function fetchAndReadResponse(
  step: "deliveryInfo" | "redemptionSubmitted" | "redemptionConfirmed",
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<
  | DeliveryInfoCallbackResponse
  | RedeemTransactionSubmittedCallbackResponse
  | RedeemTransactionConfirmedCallbackResponse
> {
  try {
    const response = await fetch(input, init);
    const isTrueOrOkOrYes = (s: string) =>
      !!s && ["true", "ok", "yes"].includes(s.toLowerCase());
    let responseBody;
    try {
      responseBody = await response.json();
    } catch {
      //
    }
    const accepted =
      response.ok && isTrueOrOkOrYes(responseBody?.accepted?.toString());
    if (!accepted) {
      throw new Error(responseBody?.reason?.toString() || response.statusText);
    }
    return {
      accepted,
      resume:
        step !== "deliveryInfo"
          ? undefined
          : isTrueOrOkOrYes(responseBody?.resume?.toString()),
      reason: ""
    };
  } catch (error) {
    console.error(`An error happened when posting ${step}: ${error}`);
    return {
      accepted: false,
      reason: (error as Error).toString(),
      resume: step !== "deliveryInfo" ? undefined : false
    };
  }
}

function postDeliveryInfoCallback(
  postDeliveryInfoUrl: string,
  postDeliveryInfoHeaders: { [key: string]: string } | undefined
) {
  return async (
    message: DeliveryInfoMessage,
    signature: string | undefined
  ): Promise<DeliveryInfoCallbackResponse> => {
    if (!postDeliveryInfoUrl) {
      throw new Error(
        "[postDeliveryInfoCallback] postDeliveryInfoUrl is not defined"
      );
    }
    return fetchAndReadResponse("deliveryInfo", postDeliveryInfoUrl, {
      method: "POST",
      body: JSON.stringify({
        step: "deliveryInfo",
        message,
        signature
      }),
      headers: {
        "content-type": "application/json;charset=UTF-8",
        ...postDeliveryInfoHeaders
      }
    }) as Promise<DeliveryInfoCallbackResponse>;
  };
}

function postRedemptionSubmittedCallback(
  postRedemptionSubmittedUrl: string,
  postRedemptionSubmittedHeaders: { [key: string]: string } | undefined
) {
  return async (
    message: RedeemTransactionSubmittedMessage
  ): Promise<RedeemTransactionConfirmedCallbackResponse> => {
    if (!postRedemptionSubmittedUrl) {
      throw new Error(
        "[postRedemptionSubmittedCallback] postRedemptionSubmittedUrl is not defined"
      );
    }
    return fetchAndReadResponse(
      "redemptionSubmitted",
      postRedemptionSubmittedUrl,
      {
        method: "POST",
        body: JSON.stringify({
          step: "redemptionSubmitted",
          message
        }),
        headers: {
          "content-type": "application/json;charset=UTF-8",
          ...postRedemptionSubmittedHeaders
        }
      }
    ) as Promise<RedeemTransactionConfirmedCallbackResponse>;
  };
}

function postRedemptionConfirmedCallback(
  postRedemptionConfirmedUrl: string,
  postRedemptionConfirmedHeaders: { [key: string]: string } | undefined
) {
  return async (
    message: RedeemTransactionConfirmedMessage
  ): Promise<RedeemTransactionSubmittedCallbackResponse> => {
    if (!postRedemptionConfirmedUrl) {
      throw new Error(
        "[postRedemptionConfirmedCallback] postRedemptionConfirmedUrl is not defined"
      );
    }
    return fetchAndReadResponse(
      "redemptionConfirmed",
      postRedemptionConfirmedUrl,
      {
        method: "POST",
        body: JSON.stringify({
          step: "redemptionConfirmed",
          message
        }),
        headers: {
          "content-type": "application/json;charset=UTF-8",
          ...postRedemptionConfirmedHeaders
        }
      }
    ) as Promise<RedeemTransactionSubmittedCallbackResponse>;
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
