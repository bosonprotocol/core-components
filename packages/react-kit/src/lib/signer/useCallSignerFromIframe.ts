import { TransactionResponse } from "@bosonprotocol/common";
import { EthersAdapter, Provider } from "@bosonprotocol/ethers-sdk";
import { Signer } from "ethers";
import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
type TransactionResponseHash = string;
export const useCallSignerFromIframe = ({
  signer,
  iframeRef,
  isIframeLoaded,
  childIframeOrigin
}: {
  signer: Signer | undefined;
  iframeRef:
    | RefObject<HTMLIFrameElement>
    | MutableRefObject<HTMLIFrameElement | undefined>;
  isIframeLoaded: boolean;
  childIframeOrigin: `http${string}`;
}) => {
  const [loadCounter, reload] = useState(0);
  const ethersSigner = useMemo(
    () =>
      signer?.provider ? new EthersAdapter(signer.provider as Provider) : null,
    [signer]
  );
  const [txMap, setTxMap] = useState(
    new Map<TransactionResponseHash, TransactionResponse>()
  );
  useEffect(() => {
    if (ethersSigner) {
      setTxMap(new Map<TransactionResponseHash, TransactionResponse>());
    }
  }, [ethersSigner]);
  useEffect(() => {
    async function onMessageReceived(event: MessageEvent) {
      if (event.origin === childIframeOrigin) {
        const functionName = event.data.function;
        if (functionName === "wait") {
          const commonPostMessage = {
            function: functionName,
            originalFunction: event.data.originalFunction
          };
          try {
            const txResponseWithoutWait = event.data.txResponse;
            const args = event.data.args ?? [];
            const txResponseWithWait = txMap.get(txResponseWithoutWait.hash);
            if (txResponseWithWait) {
              const txReceipt = await txResponseWithWait.wait(...args);
              iframeRef.current?.contentWindow?.postMessage(
                {
                  ...commonPostMessage,
                  result: txReceipt
                },
                childIframeOrigin
              );
            }
          } catch (error) {
            console.error(error);
            const eventMessage = {
              ...commonPostMessage,
              error:
                error && typeof error === "object" && "message" in error
                  ? error.message
                  : error
            };
            iframeRef.current?.contentWindow?.postMessage(
              eventMessage,
              childIframeOrigin
            );
          }
        } else if (functionName) {
          const fn: keyof typeof EthersAdapter["prototype"] = functionName;
          const signerFn: keyof typeof Signer["prototype"] = functionName;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const args: any[] = event.data.args ?? [];

          try {
            let result;
            if (
              signer &&
              signer[signerFn] &&
              typeof signer[signerFn] === "function"
            ) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              result = await signer[signerFn]?.(args[0], args[1]);
            } else {
              result = await ethersSigner?.[fn]?.(args[0], args[1]);
            }
            if (
              functionName === "sendTransaction" &&
              typeof result === "object" &&
              "wait" in result
            ) {
              const txResponse = result;
              // the wait function can not be serialized when sending the txResponse over postMessage so we exclude it
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { wait, ...txResponseWithoutWait } = txResponse;
              txMap.set(txResponse.hash, txResponse);
              const eventMessage = {
                function: functionName,
                result: txResponseWithoutWait
              };
              iframeRef.current?.contentWindow?.postMessage(
                eventMessage,
                childIframeOrigin
              );
            } else {
              const eventMessage = {
                function: functionName,
                result
              };
              iframeRef.current?.contentWindow?.postMessage(
                eventMessage,
                childIframeOrigin
              );
            }
          } catch (error) {
            console.error(error);
            const eventMessage = {
              function: functionName,
              error:
                error && typeof error === "object" && "message" in error
                  ? error.message
                  : error
            };
            iframeRef.current?.contentWindow?.postMessage(
              eventMessage,
              childIframeOrigin
            );
          }
        }
      }
    }
    if (isIframeLoaded) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hasSigner: !!ethersSigner
        },
        childIframeOrigin
      );
      if (ethersSigner) {
        window.addEventListener("message", onMessageReceived);
      }
    }
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [
    ethersSigner,
    iframeRef,
    isIframeLoaded,
    txMap,
    childIframeOrigin,
    loadCounter,
    signer
  ]);
  return {
    reload: useCallback(() => reload((prev) => ++prev), [reload])
  };
};
