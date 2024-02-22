import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt
} from "@bosonprotocol/common";
import {
  TransactionResponse as EthersTransactionResponse,
  TransactionRequest as EthersTransactionRequest
} from "@ethersproject/abstract-provider";
import { BigNumber, BigNumberish, Signer } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useExternalSigner } from "../../components/signer/useExternalSigner";
import { Deferrable } from "ethers/lib/utils";

const getDefaultHandleSignerFunction = <R>({
  parentOrigin,
  functionName,
  args
}: {
  parentOrigin: string;
  functionName: keyof Web3LibAdapter | keyof Signer;
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

const getExternalWeb3LibAdapterListener = ({
  parentOrigin
}: {
  parentOrigin: string;
}): Web3LibAdapter => {
  return {
    getSignerAddress: (): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "getSignerAddress",
        args: undefined
      });
    },
    isSignerContract: (): Promise<boolean> => {
      return getDefaultHandleSignerFunction<boolean>({
        parentOrigin,
        functionName: "isSignerContract",
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
    getBalance: async (...args: any[]): Promise<BigNumberish> => {
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
    call: async (...args: any[]): Promise<string> => {
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

const getExternalSignerListener = ({
  parentOrigin
}: {
  parentOrigin: string;
}): Signer => {
  return {
    _isSigner: true,
    provider: undefined, // TODO: how can we change this?
    getAddress: (): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "getAddress",
        args: undefined
      });
    },
    signMessage: (...args): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "signMessage",
        args
      });
    },
    signTransaction: (...args): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "signTransaction",
        args
      });
    },
    getChainId: async (): Promise<number> => {
      return getDefaultHandleSignerFunction<number>({
        parentOrigin,
        functionName: "getChainId",
        args: undefined
      });
    },
    getBalance: async (...args: any[]): Promise<BigNumber> => {
      return getDefaultHandleSignerFunction<BigNumber>({
        parentOrigin,
        functionName: "getBalance",
        args
      });
    },
    sendTransaction: async (
      transactionRequest: Deferrable<EthersTransactionRequest>
    ): Promise<EthersTransactionResponse> => {
      return new Promise<EthersTransactionResponse>((resolve, reject) => {
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
    call: async (...args: any[]): Promise<string> => {
      return getDefaultHandleSignerFunction<string>({
        parentOrigin,
        functionName: "call",
        args
      });
    },
    getTransactionCount: async (...args: any[]): Promise<number> => {
      return getDefaultHandleSignerFunction<number>({
        parentOrigin,
        functionName: "getTransactionCount",
        args
      });
    },
    getFeeData: async (...args: any[]): ReturnType<Signer["getFeeData"]> => {
      return getDefaultHandleSignerFunction<ReturnType<Signer["getFeeData"]>>({
        parentOrigin,
        functionName: "getFeeData",
        args
      });
    },
    getGasPrice: async (...args: any[]): ReturnType<Signer["getGasPrice"]> => {
      return getDefaultHandleSignerFunction<ReturnType<Signer["getGasPrice"]>>({
        parentOrigin,
        functionName: "getGasPrice",
        args
      });
    },
    populateTransaction: async (
      ...args: any[]
    ): ReturnType<Signer["populateTransaction"]> => {
      return getDefaultHandleSignerFunction<
        ReturnType<Signer["populateTransaction"]>
      >({
        parentOrigin,
        functionName: "populateTransaction",
        args
      });
    },
    estimateGas: async (...args: any[]): ReturnType<Signer["estimateGas"]> => {
      return getDefaultHandleSignerFunction<ReturnType<Signer["estimateGas"]>>({
        parentOrigin,
        functionName: "estimateGas",
        args
      });
    },
    resolveName: async (...args: any[]): ReturnType<Signer["resolveName"]> => {
      return getDefaultHandleSignerFunction<ReturnType<Signer["resolveName"]>>({
        parentOrigin,
        functionName: "resolveName",
        args
      });
    },
    _checkProvider: async (...args: any[]): Promise<void> => {
      return getDefaultHandleSignerFunction<
        ReturnType<Signer["_checkProvider"]>
      >({
        parentOrigin,
        functionName: "_checkProvider",
        args
      });
    },
    connect: (..._args: any[]): ReturnType<Signer["connect"]> => {
      // TODO: how can we implement this?
      throw new Error(
        'External signer does not implement the "connect" function'
      );
    },
    checkTransaction: (
      ...args: any[]
    ): ReturnType<Signer["checkTransaction"]> => {
      // TODO: how can we implement this?
      throw new Error(
        'External signer does not implement the "checkTransaction" function'
      );
    }
  };
};

export const useProvideExternalSigner = ({
  parentOrigin,
  withExternalSigner
}: {
  parentOrigin: string | null | undefined;
  withExternalSigner: boolean | null | undefined;
}) => {
  const externalSignerListenerObject = useMemo(
    () =>
      parentOrigin && withExternalSigner
        ? {
            externalSigner: getExternalSignerListener({ parentOrigin }),
            externalWeb3LibAdapter: getExternalWeb3LibAdapterListener({
              parentOrigin
            })
          }
        : undefined,
    [parentOrigin, withExternalSigner]
  );
  const [externalSigner, setExternalSigner] =
    useState<typeof externalSignerListenerObject>();
  useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      if (event.origin === parentOrigin) {
        if ([true, false].includes(event.data.hasSigner)) {
          if (event.data.hasSigner) {
            setExternalSigner(externalSignerListenerObject);
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
  }, [externalSigner, externalSignerListenerObject, parentOrigin]);
  return externalSigner;
};

export const useExternalSignerChainId = () => {
  const { externalSigner } = useExternalSigner() ?? {};
  return useQuery(["useExternalSignerChainId", externalSigner], () => {
    if (!externalSigner) {
      return;
    }
    return externalSigner.getChainId();
  });
};
