import React, { ReactNode, useCallback } from "react";
import { useProvider } from "../../../hooks/connection/connection";
import { useIsWindowVisible } from "../../../hooks/uniswap/useIsWindowVisible";
import { CONFIG } from "../../../lib/config/config";
import { Updaters } from "../../../state/updaters";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { ModalProvider } from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { WalletConnectionProviderProps } from "../../wallet/WalletConnectionProvider";
import {
  ReduxProvider,
  WithReduxProvider,
  WithReduxProviderProps
} from "../ReduxProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName"> &
  BosonProviderProps &
  WithReduxProviderProps & {
    children: ReactNode;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const CommitWidgetReduxUpdaters = Updaters;
export const CommitWidgetReduxProvider = ReduxProvider;

export const CommitWidgetProviders: React.FC<CommitWidgetProvidersProps> =
  withQueryClientProvider(
    ({ children, withReduxProvider, withCustomReduxContext, ...props }) => {
      const isWindowVisible = useIsWindowVisible();
      const WithUpdaters = useCallback(
        ({ children: updatersChildren }: { children: ReactNode }) => {
          return withReduxProvider ? (
            <UpdatersWrapper
              isWindowVisible={isWindowVisible}
              withWeb3React={props.withWeb3React}
            >
              {updatersChildren}
            </UpdatersWrapper>
          ) : (
            <>{updatersChildren}</>
          );
        },
        [withReduxProvider, isWindowVisible, props.withWeb3React]
      );
      return (
        <WithReduxProvider
          withCustomReduxContext={withCustomReduxContext}
          withReduxProvider={withReduxProvider}
        >
          <ConfigProvider
            magicLinkKey={magicLinkKey}
            infuraKey={infuraKey}
            withCustomReduxContext={withCustomReduxContext}
            {...props}
          >
            <BosonProvider {...props}>
              <WithUpdaters>
                <ChatProvider>
                  <IpfsProvider {...props}>
                    <ConvertionRateProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </ConvertionRateProvider>
                  </IpfsProvider>
                </ChatProvider>
              </WithUpdaters>
            </BosonProvider>
          </ConfigProvider>
        </WithReduxProvider>
      );
    }
  );

function UpdatersWrapper({
  children,
  isWindowVisible,
  withWeb3React
}: {
  children: ReactNode;
  isWindowVisible: boolean;
  withWeb3React: boolean;
}) {
  const provider = useProvider();
  return (
    <Updaters
      isWindowVisible={isWindowVisible}
      provider={provider}
      withWeb3React={withWeb3React}
    >
      {children}
    </Updaters>
  );
}
