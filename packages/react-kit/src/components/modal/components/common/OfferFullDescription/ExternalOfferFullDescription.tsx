import React from "react";
import {
  OfferFullDescription,
  OfferFullDescriptionProps
} from "./OfferFullDescription";
import { DetailViewWithProvider } from "../detail/DetailViewWithProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../../../config/ConfigProvider";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../../../wallet/WalletConnectionProvider";
import { MagicProvider } from "../../../../magicLink/MagicContext";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStyle from "../../../../styles/GlobalStyle";
import { IpfsProvider } from "../../../../ipfs/IpfsProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
export type ExternalOfferFullDescriptionProps = Omit<
  OfferFullDescriptionProps,
  "defaultSelectedTabId"
> & {
  providerProps: Omit<ConfigProviderProps, "children"> &
    Omit<WalletConnectionProviderProps, "children" | "envName">;
  defaultSelectedOfferTabsIdTab?: OfferFullDescriptionProps["defaultSelectedTabId"];
};

export const ExternalOfferFullDescription: React.FC<
  ExternalOfferFullDescriptionProps
> = (props) => {
  return (
    <ConfigProvider {...props.providerProps}>
      <GlobalStyle />
      <MagicProvider>
        <QueryClientProvider client={queryClient}>
          <WalletConnectionProvider
            walletConnectProjectId={props.providerProps.walletConnectProjectId}
          >
            <IpfsProvider {...props}>
              <DetailViewWithProvider offer={props.offer}>
                <OfferFullDescription
                  {...props}
                  defaultSelectedTabId={props.defaultSelectedOfferTabsIdTab}
                />
              </DetailViewWithProvider>
            </IpfsProvider>
          </WalletConnectionProvider>
        </QueryClientProvider>
      </MagicProvider>
    </ConfigProvider>
  );
};
