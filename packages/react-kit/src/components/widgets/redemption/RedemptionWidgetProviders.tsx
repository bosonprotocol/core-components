import React, { ReactNode } from "react";
import { CONFIG } from "../../../lib/config/config";
import ChatProvider from "../../chat/ChatProvider/ChatProvider";
import {
  ConfigProvider,
  ConfigProviderProps
} from "../../config/ConfigProvider";
import { IpfsProvider, IpfsProviderProps } from "../../ipfs/IpfsProvider";
import { ModalProvider } from "../../modal/ModalProvider";
import { withQueryClientProvider } from "../../queryClient/withQueryClientProvider";
import { SignerProvider } from "../../signer/SignerProvider";
import GlobalStyle from "../../styles/GlobalStyle";
import { WithReduxProvider, WithReduxProviderProps } from "../ReduxProvider";
import { getParentWindowOrigin } from "../common";
import ConvertionRateProvider, {
  ConvertionRateProviderProps
} from "../finance/convertion-rate/ConvertionRateProvider";
import { CommonWidgetTypes } from "../types";
import { RedemptionContextProps } from "./provider/RedemptionContext";
import { RedemptionProvider } from "./provider/RedemptionProvider";
import { BosonProvider, BosonProviderProps } from "../../boson/BosonProvider";
import { Web3Provider, Web3ProviderProps } from "../../wallet2/web3Provider";
import { BlockNumberProvider } from "../../../hooks/contracts/useBlockNumber";

export type RedemptionWidgetProvidersProps = IpfsProviderProps &
  Omit<ConfigProviderProps, "magicLinkKey" | "infuraKey"> &
  Omit<RedemptionContextProps, "setWidgetAction"> &
  ConvertionRateProviderProps &
  CommonWidgetTypes &
  Omit<Web3ProviderProps, "infuraKey"> &
  BosonProviderProps &
  WithReduxProviderProps & {
    signatures?: string[] | undefined | null; // signature1,signature2,signature3
  } & {
    children: ReactNode;
  };

const { infuraKey, magicLinkKey } = CONFIG;

export const RedemptionWidgetProviders: React.FC<RedemptionWidgetProvidersProps> =
  withQueryClientProvider(({ children, ...props }) => {
    const parentOrigin = getParentWindowOrigin();
    return (
      <WithReduxProvider
        withCustomReduxContext={props.withCustomReduxContext}
        withReduxProvider={props.withReduxProvider}
      >
        <Web3Provider {...props} infuraKey={infuraKey}>
          <ConfigProvider
            magicLinkKey={magicLinkKey}
            {...props}
            infuraKey={infuraKey}
          >
            <BlockNumberProvider>
              <BosonProvider {...props}>
                <GlobalStyle />
                <SignerProvider
                  parentOrigin={parentOrigin}
                  withExternalSigner={props.withExternalSigner}
                >
                  <ChatProvider>
                    <IpfsProvider {...props}>
                      <ConvertionRateProvider>
                        <ModalProvider>
                          <RedemptionProvider {...props}>
                            {children}
                          </RedemptionProvider>
                        </ModalProvider>
                      </ConvertionRateProvider>
                    </IpfsProvider>
                  </ChatProvider>
                </SignerProvider>
              </BosonProvider>
            </BlockNumberProvider>
          </ConfigProvider>
        </Web3Provider>
      </WithReduxProvider>
    );
  });
