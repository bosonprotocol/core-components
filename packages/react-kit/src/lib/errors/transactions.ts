import { Provider } from "@bosonprotocol/ethers-sdk";
import * as Sentry from "@sentry/browser";
import getRevertReason from "eth-revert-reason";
import { providers } from "ethers";

export async function extractUserFriendlyError(
  error: unknown,
  {
    defaultError = "Please retry this action",
    txResponse,
    provider
  }: {
    defaultError?: string;
    txResponse?: providers.TransactionResponse;
    provider?: Provider;
  } = {}
): Promise<string> {
  try {
    if (!error || typeof error !== "object") {
      return defaultError;
    }
    if (txResponse) {
      const revertReason = await getRevertReason(
        txResponse.hash,
        "mainnet", // mumbai is not supported
        txResponse.blockNumber,
        provider
      );
      return revertReason ?? defaultError;
    }
    // meta transactions
    const m = error.toString().match(/(?<=execution reverted: ).*/)?.[0];
    const endIndexSlash = m?.indexOf(`\\",`);
    const endIndexWithoutSlash = m?.indexOf(`",`);
    const details = m?.substring(
      0,
      endIndexSlash &&
        endIndexSlash !== -1 &&
        endIndexWithoutSlash &&
        endIndexWithoutSlash !== -1
        ? Math.min(endIndexSlash, endIndexWithoutSlash)
        : endIndexSlash !== -1 && endIndexSlash
        ? endIndexSlash
        : endIndexWithoutSlash
    );
    return details ?? defaultError;
  } catch (error) {
    console.error("[extractUserFriendlyError]", error);
    Sentry.captureException(error);
    return defaultError;
  }
}

export function getHasUserRejectedTx(error: unknown): boolean {
  const hasUserRejectedTx =
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "ACTION_REJECTED";
  return hasUserRejectedTx;
}
