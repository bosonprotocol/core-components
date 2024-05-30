import React, { ReactNode, useCallback } from "react";
import { useProvider } from "../../../hooks/connection/connection";
import { useIsWindowVisible } from "../../../hooks/uniswap/useIsWindowVisible";
import { CONFIG } from "../../../lib/config/config";
import { Updaters } from "../../../state/updaters";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { MagicProvider } from "../../magicLink/MagicProvider";
import ModalProvider from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import { ReduxProvider } from "../ReduxProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName"> & {
    children: ReactNode;
    withReduxProvider: boolean;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const CommitWidgetReduxUpdaters = Updaters;
export const CommitWidgetReduxProvider = ReduxProvider;

export const CommitWidgetProviders: React.FC<CommitWidgetProvidersProps> =
  withQueryClientProvider(({ children, withReduxProvider, ...props }) => {
    const isWindowVisible = useIsWindowVisible();
    const WithReduxProvider = useCallback(
      ({ children: providersChildren }: { children: ReactNode }) => {
        return withReduxProvider ? (
          <ReduxProvider>{providersChildren}</ReduxProvider>
        ) : (
          <>{providersChildren}</>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [withReduxProvider]
    );
    const WithUpdaters = useCallback(
      ({ children: updatersChildren }: { children: ReactNode }) => {
        return withReduxProvider ? (
          <UpdatersWrapper isWindowVisible={isWindowVisible}>
            {updatersChildren}
          </UpdatersWrapper>
        ) : (
          <>{updatersChildren}</>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      [withReduxProvider, isWindowVisible]
    );
    return (
      <WithReduxProvider>
        <ConfigProvider
          magicLinkKey={magicLinkKey}
          infuraKey={infuraKey}
          {...props}
        >
          <MagicProvider>
            <WalletConnectionProvider
              walletConnectProjectId={props.walletConnectProjectId}
            >
              <WithUpdaters>
                <ChatProvider>
                  <IpfsProvider {...props}>
                    <ConvertionRateProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </ConvertionRateProvider>
                  </IpfsProvider>
                </ChatProvider>
              </WithUpdaters>
            </WalletConnectionProvider>
          </MagicProvider>
        </ConfigProvider>
      </WithReduxProvider>
    );
  });

function UpdatersWrapper({
  children,
  isWindowVisible
}: {
  children: ReactNode;
  isWindowVisible: boolean;
}) {
  const provider = useProvider();
  return (
    <Updaters isWindowVisible={isWindowVisible} provider={provider}>
      {children}
    </Updaters>
  );
}
