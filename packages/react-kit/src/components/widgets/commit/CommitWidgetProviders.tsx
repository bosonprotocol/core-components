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
import {
  ReduxProvider,
  WithReduxProvider,
  WithReduxProviderProps
} from "../ReduxProvider";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";
import {
  RedemptionProvider,
  RedemptionProviderProps
} from "../redemption/provider/RedemptionProvider";
import {
  RobloxProvider,
  RobloxProviderProps
} from "../../../hooks/roblox/context/RobloxProvider";

export type CommitWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  RedemptionProviderProps &
  RobloxProviderProps &
  ConvertionRateProviderProps &
  Omit<Web3ProviderProps, "infuraKey"> &
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
          <Web3Provider {...props} infuraKey={infuraKey}>
            <ConfigProvider
              magicLinkKey={magicLinkKey}
              infuraKey={infuraKey}
              withCustomReduxContext={withCustomReduxContext}
              {...props}
            >
              <BlockNumberProvider>
                <BosonProvider {...props}>
                  <WithUpdaters>
                    <ChatProvider>
                      <IpfsProvider {...props}>
                        <ConvertionRateProvider>
                          <RedemptionProvider {...props}>
                            <RobloxProvider {...props}>
                              <ModalProvider>{children}</ModalProvider>
                            </RobloxProvider>
                          </RedemptionProvider>
                        </ConvertionRateProvider>
                      </IpfsProvider>
                    </ChatProvider>
                  </WithUpdaters>
                </BosonProvider>
              </BlockNumberProvider>
            </ConfigProvider>
          </Web3Provider>
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
