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
import { IpfsProvider, IpfsProviderProps } from "../../../../ipfs/IpfsProvider";

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
    Omit<WalletConnectionProviderProps, "children" | "envName"> &
    Omit<IpfsProviderProps, "children">;
  defaultSelectedOfferTabsIdTab?: OfferFullDescriptionProps["defaultSelectedTabId"];
};

export const ExternalOfferFullDescription: React.FC<
  ExternalOfferFullDescriptionProps
> = (props) => {
  return (
    <ConfigProvider {...props.providerProps}>
      <MagicProvider>
        <QueryClientProvider client={queryClient}>
          <WalletConnectionProvider
            walletConnectProjectId={props.providerProps.walletConnectProjectId}
          >
            <IpfsProvider {...props.providerProps}>
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
