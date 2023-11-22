import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Web3LibAdapter,
  TransactionRequest,
  TransactionResponse,
  TransactionReceipt
} from "@bosonprotocol/common";
import useOffersBacked from "./useOffersBacked";
import Loading from "../../ui/loading/Loading";
import Finance, { Props } from "./Finance";
import { useSellerRoles } from "./useSellerRoles";
import { useConvertionRate } from "./convertion-rate/useConvertionRate";
import { useExchangeTokens } from "./exchange-tokens/useExchangeTokens";
import { useSellerDeposit } from "./useSellerDeposit";
import useFunds from "./useFunds";
import WalletConnectionProvider from "../../wallet/WalletConnectionProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../../environment/EnvironmentProvider";
import ModalProvider from "../../modal/ModalProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "./convertion-rate/ConvertionRateProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { CONFIG } from "../../../lib/config/config";
import { MagicProvider } from "../../magicLink/MagicContext";
import { useAccount } from "../../../hooks/connection/connection";
import { SignerProvider } from "../../signer/SignerContext";
import { BigNumberish } from "ethers";
dayjs.extend(isBetween);

const Wrapper = styled.div`
  text-align: center;
`;

function WithSellerData(WrappedComponent: React.ComponentType<Props>) {
  const ComponentWithSellerData = (props: Pick<Props, "sellerId">) => {
    const sellerId = props.sellerId;
    const sellerRoles = useSellerRoles(sellerId || "");
    console.log(useAccount());
    const {
      store: { tokens }
    } = useConvertionRate();

    const exchangesTokens = useExchangeTokens(
      {
        sellerId: sellerId || ""
      },
      {
        enabled: !!sellerId
      }
    );
    const sellerDeposit = useSellerDeposit(
      {
        sellerId: sellerId || ""
      },
      { enabled: !!sellerId }
    );
    const funds = useFunds(sellerId || "", tokens);
    const newProps = useMemo(
      () => ({
        sellerId,
        exchangesTokens,
        sellerDeposit,
        funds,
        sellerRoles
      }),
      [sellerId, exchangesTokens, sellerDeposit, funds, sellerRoles]
    );

    const offersBacked = useOffersBacked({ ...newProps });

    if (exchangesTokens.isLoading || sellerDeposit.isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }
    return (
      <WrappedComponent {...props} {...newProps} offersBacked={offersBacked} />
    );
  };
  return ComponentWithSellerData;
}

const Component = WithSellerData(Finance);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

type FinanceWidgetProps = {
  walletConnectProjectId: string;
} & Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  EnvironmentProviderProps &
  ConvertionRateProviderProps &
  Parameters<typeof Component>[0];

const { infuraKey, magicLinkKey } = CONFIG;
const externalSignerListener: Web3LibAdapter = {
  getSignerAddress: (): Promise<string> => {
    return new Promise<string>((resolve) => {
      window.parent.postMessage({
        function: "getSignerAddress",
        args: undefined
      });
      function onMessageReceived(event: MessageEvent) {
        if (event.origin === "localhost:3000") {
          console.log("data received", event.data);
          if (event.data.function === "getSignerAddress") {
            resolve(event.data.result);
          }
        }
      }
      window.addEventListener("message", onMessageReceived);
      // return () => {
      //   window.removeEventListener("message", onMessageReceived);
      // };
    });
  },
  getChainId: async (): Promise<number> => {
    console.log("getChainId not implemented");
    return 0;
  },
  getBalance: async (
    addressOrName: string,
    blockNumber?: string | number
  ): Promise<BigNumberish> => {
    console.log("getBalance not implemented", { addressOrName, blockNumber });
    return "0";
  },
  sendTransaction: async (
    transactionRequest: TransactionRequest
  ): Promise<TransactionResponse> => {
    console.log("sendTransaction not implemented", { transactionRequest });
    return {
      hash: "",
      wait: () =>
        Promise.resolve({
          effectiveGasPrice: "",
          from: "",
          to: "",
          logs: [],
          transactionHash: "",
          status: undefined
        })
    };
  },
  call: async (transactionRequest: TransactionRequest): Promise<string> => {
    console.log("call not implemented", { transactionRequest });
    return "";
  },
  send: async (rpcMethod: string, payload: unknown[]): Promise<string> => {
    console.log("send not implemented", { rpcMethod, payload });
    return "";
  },
  getTransactionReceipt: async (
    txHash: string
  ): Promise<TransactionReceipt> => {
    console.log("getTransactionReceipt not implemented", { txHash });
    return {
      effectiveGasPrice: "",
      from: "",
      to: "",
      logs: [],
      transactionHash: "",
      status: undefined
    };
  }
};
export function FinanceWidget({
  envName,
  configId,
  walletConnectProjectId,
  sellerId,
  metaTx,
  ...rest
}: FinanceWidgetProps) {
  const [externalSigner, setExternalSigner] = useState<
    Web3LibAdapter | undefined
  >();
  useEffect(() => {
    function onMessageReceived(event: MessageEvent) {
      if (event.origin === "localhost:3000") {
        console.log("data received", event.data);
        if (event.data.hasSigner) {
          setExternalSigner(undefined);
        } else {
          setExternalSigner(externalSignerListener);
        }
      }
    }
    window.addEventListener("message", onMessageReceived);
    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [externalSigner]);
  return (
    <EnvironmentProvider envName={envName} configId={configId} metaTx={metaTx}>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, prettier/prettier
        /* @ts-ignore */}
      <GlobalStyle />
      <ConfigProvider
        magicLinkKey={magicLinkKey}
        infuraKey={infuraKey}
        {...rest}
      >
        <SignerProvider externalSigner={externalSigner}>
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={walletConnectProjectId}
            >
              <QueryClientProvider client={queryClient}>
                <ConvertionRateProvider>
                  <ModalProvider>
                    <Component sellerId={sellerId} />
                  </ModalProvider>
                </ConvertionRateProvider>
              </QueryClientProvider>
            </WalletConnectionProvider>
          </MagicProvider>
        </SignerProvider>
      </ConfigProvider>
    </EnvironmentProvider>
  );
}

export default FinanceWidget;
