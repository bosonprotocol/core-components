import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt
} from "@bosonprotocol/common";
import { BigNumberish } from "ethers";
import { useEffect, useMemo, useState } from "react";

const getDefaultHandleSignerFunction = <R>({
  parentOrigin,
  functionName,
  args
}: {
  parentOrigin: string;
  functionName: keyof Web3LibAdapter;
  args: unknown[] | undefined;
}): Promise<R> => {
  return new Promise<R>((resolve, reject) => {
    function onMessageReceived(event: MessageEvent) {
      if (event.origin === parentOrigin) {
        if (event.data.function === functionName) {
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else if (event.data.result) {
            resolve(event.data.result);
          }
          window.removeEventListener("message", onMessageReceived);
        }
      }
    }
    window.addEventListener("message", onMessageReceived);
    window.parent.postMessage(
      {
        function: functionName,
        args
      },
      parentOrigin
    );
  });
};

const getExternalSignerListener = ({
  parentOrigin
}: {
  parentOrigin: `http${string}`;
}): Web3LibAdapter => {
  return {
    getSignerAddress: (): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "getSignerAddress",
        args: undefined
      });
    },
    getChainId: async (): Promise<number> => {
      return getDefaultHandleSignerFunction<number>({
        parentOrigin,
        functionName: "getChainId",
        args: undefined
      });
    },
    getBalance: async (...args): Promise<BigNumberish> => {
      return getDefaultHandleSignerFunction<BigNumberish>({
        parentOrigin,
        functionName: "getBalance",
        args
      });
    },
    sendTransaction: async (
      transactionRequest: TransactionRequest
    ): Promise<TransactionResponse> => {
      return new Promise<TransactionResponse>((resolve, reject) => {
        const functionName = "sendTransaction";
        function onMessageReceived(event: MessageEvent) {
          if (event.origin === parentOrigin) {
            if (event.data.function === functionName) {
              if (event.data.error) {
                reject(new Error(event.data.error));
              } else if (event.data.result) {
                const txResponseWithoutWait = event.data.result;
                resolve({
                  ...txResponseWithoutWait,
                  wait: async (
                    confirmations?: number
                  ): Promise<TransactionReceipt> => {
                    return new Promise<TransactionReceipt>(
                      (resolve, reject) => {
                        function onWaitMessageReceived(event: MessageEvent) {
                          if (event.origin === parentOrigin) {
                            if (
                              event.data.function === "wait" &&
                              event.data.originalFunction === functionName
                            ) {
                              if (event.data.error) {
                                reject(new Error(event.data.error));
                              } else if (event.data.result) {
                                resolve(event.data.result);
                              }
                              window.removeEventListener(
                                "message",
                                onWaitMessageReceived
                              );
                            }
                          }
                        }
                        window.addEventListener(
                          "message",
                          onWaitMessageReceived
                        );
                        window.parent.postMessage(
                          {
                            originalFunction: functionName,
                            originalArgs: [transactionRequest],
                            txResponse: txResponseWithoutWait,
                            function: "wait",
                            args:
                              confirmations === undefined ? [] : [confirmations]
                          },
                          "*"
                        );
                      }
                    );
                  }
                });
              }
            }
          }
        }
        window.addEventListener("message", onMessageReceived);
        window.parent.postMessage(
          {
            function: functionName,
            args: [transactionRequest]
          },
          parentOrigin
        );
      });
    },
    call: async (...args): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "call",
        args
      });
    },
    send: async (...args): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "send",
        args
      });
    },
    getTransactionReceipt: async (...args): Promise<TransactionReceipt> => {
      return getDefaultHandleSignerFunction<TransactionReceipt>({
        parentOrigin,
        functionName: "getTransactionReceipt",
        args
      });
    }
  };
};

export const useProvideExternalSigner = ({
  parentOrigin
}: {
  parentOrigin: `http${string}` | null | undefined;
}) => {
  const externalSignerListener = useMemo(
    () =>
      parentOrigin ? getExternalSignerListener({ parentOrigin }) : undefined,
    [parentOrigin]
  );
  const [externalSigner, setExternalSigner] = useState<
    Web3LibAdapter | undefined
  >();
  useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      if (event.origin === parentOrigin) {
        if ([true, false].includes(event.data.hasSigner)) {
          if (event.data.hasSigner) {
            setExternalSigner(externalSignerListener);
          } else {
            setExternalSigner(undefined);
          }
        }
      }
    }
    window.addEventListener("message", onMessageReceived);
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [externalSigner, externalSignerListener, parentOrigin]);
  return externalSigner;
};
