import { TransactionResponse, TransactionReceipt } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/core-sdk";
import { errors, providers } from "ethers";
import { useState } from "react";

import { CtaButtonProps, Action } from "../components/cta/common/types";
export { Action, ActionName } from "../components/cta/common/types";

export function useCtaClickHandler<T>({
  waitBlocks,
  coreSdk,
  useMetaTx,
  actions,
  onPendingSignature,
  onPendingTransaction,
  onCancelledTransaction,
  onRepricedTransaction,
  onError,
  onSuccess,
  successPayload
}: {
  waitBlocks: number;
  coreSdk: Pick<
    CoreSDK,
    "relayNativeMetaTransaction" | "relayMetaTransaction" | "parseError"
  >;
  useMetaTx: boolean;
  actions: Action[];
  successPayload: T | ((receipt: providers.TransactionReceipt) => T);
} & Pick<
  CtaButtonProps<T>,
  | "onPendingSignature"
  | "onCancelledTransaction"
  | "onRepricedTransaction"
  | "onPendingTransaction"
  | "onError"
  | "onSuccess"
>) {
  const [isLoading, setIsLoading] = useState(false);

  const clickHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let txResponse: TransactionResponse | undefined = undefined;
    let receipt: TransactionReceipt | undefined = undefined;

    try {
      setIsLoading(true);

      for (const action of actions) {
        const {
          name,
          signMetaTxFn,
          writeContractFn,
          additionalMetaTxCondition = true,
          nativeMetaTxContract,
          shouldActionRun = () => Promise.resolve(true)
        } = action;

        if (!(await shouldActionRun())) {
          continue;
        }

        const isMetaTx = useMetaTx && signMetaTxFn && additionalMetaTxCondition;

        onPendingSignature?.(name);

        if (isMetaTx) {
          const nonce = Date.now();

          const { r, s, v, functionName, functionSignature } =
            await signMetaTxFn();

          txResponse = nativeMetaTxContract
            ? await coreSdk.relayNativeMetaTransaction(nativeMetaTxContract, {
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v
              })
            : await coreSdk.relayMetaTransaction({
                functionName,
                functionSignature,
                sigR: r,
                sigS: s,
                sigV: v,
                nonce
              });
        } else {
          txResponse = await writeContractFn();
        }

        if (txResponse) {
          try {
            onPendingTransaction?.(txResponse.hash, isMetaTx, name);
            receipt = await txResponse.wait(waitBlocks);
          } catch (error: any) {
            // Handle transaction that was replaced, canceled or repriced.
            // See https://docs.ethers.io/v5/api/utils/logger/#errors--transaction-replaced
            // for details.
            if (error.code === errors.TRANSACTION_REPLACED) {
              // Transaction was replaced or cancelled
              if (error.cancelled) {
                if (onCancelledTransaction) {
                  onCancelledTransaction(
                    txResponse.hash,
                    error.replacement,
                    isMetaTx
                  );
                } else {
                  throw error;
                }
              } else {
                // Transaction was repriced, i.e. speed up
                onRepricedTransaction?.(
                  txResponse.hash,
                  error.replacement,
                  error.receipt,
                  isMetaTx,
                  name
                );
                receipt = error.receipt;
              }
            } else {
              throw error;
            }
          }
        }
      }

      if (receipt) {
        const payload =
          successPayload instanceof Function
            ? successPayload(receipt as providers.TransactionReceipt)
            : successPayload;
        onSuccess?.(receipt as providers.TransactionReceipt, payload);
      }
    } catch (error) {
      onError?.(
        typeof error === "object"
          ? (coreSdk.parseError(error as object) as Error)
          : (error as Error),
        {
          txResponse: txResponse as providers.TransactionResponse
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { clickHandler, isLoading };
}
