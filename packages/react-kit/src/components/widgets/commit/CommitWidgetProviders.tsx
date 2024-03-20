import React, { ReactNode, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { MagicProvider } from "../../magicLink/MagicProvider";
import ModalProvider from "../../modal/ModalProvider";
import WalletConnectionProvider, {
  WalletConnectionProviderProps
} from "../../wallet/WalletConnectionProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { Updaters, UpdatersProps } from "../../../state/updaters";
import { Provider } from "react-redux";
import store from "../../../state";
import { ReduxCCDummyContext } from "../../../state/reduxContext";
import { useIsWindowVisible } from "../../../hooks/uniswap/useIsWindowVisible";
import { useProvider } from "../../../hooks/connection/connection";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  ConvertionRateProviderProps &
  Omit<WalletConnectionProviderProps, "children" | "envName"> & {
    children: ReactNode;
    withReduxProvider: boolean;
  };

const { infuraKey, magicLinkKey } = CONFIG;
export const CommitWidgetReduxProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  return (
    // it doesnt matter what the initial value of the context is, hence the any cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Provider store={store} context={ReduxCCDummyContext as any}>
      {children}
    </Provider>
  );
};
export const CommitWidgetReduxUpdaters = ({
  children,
  ...rest
}: UpdatersProps) => {
  return <Updaters {...rest}>{children}</Updaters>;
};

export const CommitWidgetProviders: React.FC<CommitWidgetProvidersProps> =
  withQueryClientProvider(({ children, withReduxProvider, ...props }) => {
    const isWindowVisible = useIsWindowVisible();
    const WithReduxProvider = useCallback(
      ({ children: providersChildren }: { children: ReactNode }) => {
        return withReduxProvider ? (
          <CommitWidgetReduxProvider>
            {providersChildren}
          </CommitWidgetReduxProvider>
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
