import { fn } from "@storybook/test";
import React, { ReactNode } from "react";
import { Meta } from "@storybook/react";
import {
  ChainSelector,
  ConnectWallet,
  Portal,
  AccountDrawer,
  Web3Provider,
  Grid,
  bosonButtonThemes,
  ConnectWalletProps,
  getEnvConfigs,
  EnvironmentType,
  theme,
  ConfigProvider
} from "../index";
import { HashRouter, Route, Routes } from "react-router-dom";
import { bosonButtonThemeKeys } from "../components/ui/ThemedButton";
import { CSSProperties, createGlobalStyle } from "styled-components";
import { Wallet } from "phosphor-react";
import { ReduxProvider } from "../components/widgets/ReduxProvider";
import { BlockNumberProvider } from "../hooks/contracts/useBlockNumber";
const colors = theme.colors.light;
const successButtonTheme: ConnectWalletProps["connectWalletButtonTheme"] = {
  ...bosonButtonThemes({ withBosonStyle: false })["primary"],
  color: "inherit",
  background: "var(--buttonBgColor)"
};
const errorButtonTheme = bosonButtonThemes({ withBosonStyle: false })[
  "orangeInverse"
];

const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
const config = envConfig[0];
const configId = config.configId;
console.log({ configId });
const ColorGlobalStyle = createGlobalStyle<{ color: CSSProperties["color"] }>`
  html, body{
    color: ${({ color }) => color};
  }
`;
const Component = ({
  showStatusIcon,
  rightConnectedChild,
  connectWalletChild,
  textColor,
  chainSelectorBackgroundColor,
  connectWalletBorderRadius,
  connectWalletSuccessButtonThemeKey,
  connectWalletErrorButtonThemeKey,
  accountDrawerBuyCryptoBorderRadiusPx,
  accountDrawerBackgroundColor,
  accountDrawerBuyCryptoThemeKey,
  accountDrawerDisconnectBackgroundColor,
  accountDrawerDisconnectBorderRadius,
  accountDrawerDisconnectColor,
  walletBorderRadius,
  walletIconBorderRadius,
  walletBackgroundColor,
  walletColor,
  walletHoverFocusBackgroundColor,
  walletHoverColor,
  magicLoginButtonThemeKey,
  connectionErrorTryAgainButtonThemeKey,
  connectionErrorBackToWalletSelectionButtonThemeKey,
  magicLoginButtonBorderRadiusPx,
  withMagicLogin,
  onUserDisconnect
}: {
  showStatusIcon: boolean;
  rightConnectedChild?: ReactNode;
  textColor: string;
  connectWalletChild: string;
  chainSelectorBackgroundColor: string | undefined;
  connectWalletBorderRadius: string | undefined;
  connectWalletSuccessButtonThemeKey: string | undefined;
  connectWalletErrorButtonThemeKey: string | undefined;
  accountDrawerBackgroundColor: string | undefined;
  accountDrawerBuyCryptoBorderRadiusPx: string | undefined;
  accountDrawerBuyCryptoThemeKey: string | undefined;
  accountDrawerDisconnectBorderRadius: string | undefined;
  accountDrawerDisconnectBackgroundColor: string | undefined;
  accountDrawerDisconnectColor: string | undefined;
  walletBorderRadius: string | undefined;
  walletIconBorderRadius: string | undefined;
  walletBackgroundColor: string | undefined;
  walletColor: string | undefined;
  walletHoverFocusBackgroundColor: string | undefined;
  walletHoverColor: string | undefined;
  magicLoginButtonThemeKey: string | undefined;
  connectionErrorTryAgainButtonThemeKey: string;
  connectionErrorBackToWalletSelectionButtonThemeKey: string;
  magicLoginButtonBorderRadiusPx: string | undefined;
  withMagicLogin: boolean | undefined;
  onUserDisconnect: () => unknown;
}) => {
  const infuraKey = process.env.STORYBOOK_REACT_APP_INFURA_KEY || "";
  const walletConnectProjectId =
    process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "";
  const withCustomReduxContext = false;
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <header>
              <ColorGlobalStyle color={textColor} />
              <ReduxProvider withCustomContext={withCustomReduxContext}>
                <Web3Provider
                  configId={configId}
                  envName={envName}
                  infuraKey={infuraKey}
                  walletConnectProjectId={walletConnectProjectId}
                >
                  <ConfigProvider
                    {...{
                      configId,
                      dateFormat: "",
                      defaultCurrencySymbol: "",
                      defaultCurrencyTicker: "",
                      envName,
                      infuraKey,
                      magicLinkKey:
                        process.env.STORYBOOK_REACT_APP_MAGIC_API_KEY || "",
                      shortDateFormat: "",
                      walletConnectProjectId,
                      withWeb3React: true,
                      externalConnectedAccount: undefined,
                      externalConnectedChainId: undefined,
                      externalConnectedSigner: undefined,
                      metaTx: undefined,
                      usePendingTransactions: undefined,
                      withExternalConnectionProps: false,
                      withCustomReduxContext
                    }}
                  >
                    <BlockNumberProvider>
                      <Grid>
                        <ChainSelector
                          leftAlign={true}
                          backgroundColor={chainSelectorBackgroundColor}
                          config={config}
                        />
                        <ConnectWallet
                          showStatusIcon={showStatusIcon}
                          connectWalletChild={connectWalletChild}
                          rightConnectedChild={rightConnectedChild}
                          connectWalletButtonTheme={{
                            ...(connectWalletSuccessButtonThemeKey
                              ? bosonButtonThemes({ withBosonStyle: false })[
                                  connectWalletSuccessButtonThemeKey
                                ]
                              : successButtonTheme),
                            borderRadius: connectWalletBorderRadius,
                            gap: "2px"
                          }}
                          connectedButtonTheme={{
                            ...(connectWalletSuccessButtonThemeKey
                              ? bosonButtonThemes({ withBosonStyle: false })[
                                  connectWalletSuccessButtonThemeKey
                                ]
                              : successButtonTheme),
                            borderRadius: connectWalletBorderRadius,
                            gap: "2px"
                          }}
                          errorButtonTheme={{
                            ...(connectWalletErrorButtonThemeKey
                              ? bosonButtonThemes({ withBosonStyle: false })[
                                  connectWalletErrorButtonThemeKey
                                ]
                              : errorButtonTheme),
                            borderRadius: connectWalletBorderRadius,
                            gap: "2px"
                          }}
                        />
                      </Grid>
                      <Portal>
                        <AccountDrawer
                          backgroundColor={accountDrawerBackgroundColor}
                          buyCryptoTheme={{
                            ...(accountDrawerBuyCryptoThemeKey
                              ? bosonButtonThemes({ withBosonStyle: false })[
                                  accountDrawerBuyCryptoThemeKey
                                ]
                              : successButtonTheme),
                            borderRadius: accountDrawerBuyCryptoBorderRadiusPx
                          }}
                          disconnectBorderRadius={
                            accountDrawerDisconnectBorderRadius
                          }
                          disconnectBackgroundColor={
                            accountDrawerDisconnectBackgroundColor
                          }
                          disconnectColor={accountDrawerDisconnectColor}
                          onUserDisconnect={onUserDisconnect}
                          walletModalProps={{
                            withMagicLogin,
                            optionProps: {
                              backgroundColor: walletBackgroundColor,
                              color: walletColor,
                              borderRadius: walletBorderRadius,
                              iconBorderRadius: walletIconBorderRadius,
                              hoverFocusBackgroundColor:
                                walletHoverFocusBackgroundColor,
                              hoverColor: walletHoverColor
                            },
                            magicLoginButtonProps: {
                              buttonProps: {
                                theme: {
                                  ...(magicLoginButtonThemeKey
                                    ? bosonButtonThemes({
                                        withBosonStyle: false
                                      })[magicLoginButtonThemeKey]
                                    : successButtonTheme),
                                  borderRadius: magicLoginButtonBorderRadiusPx
                                }
                              }
                            },
                            connectionErrorProps: {
                              tryAgainTheme:
                                connectionErrorTryAgainButtonThemeKey
                                  ? bosonButtonThemes({
                                      withBosonStyle: false
                                    })[connectionErrorTryAgainButtonThemeKey]
                                  : successButtonTheme,
                              backToWalletSelectionTheme:
                                connectionErrorBackToWalletSelectionButtonThemeKey
                                  ? bosonButtonThemes({
                                      withBosonStyle: false
                                    })[
                                      connectionErrorBackToWalletSelectionButtonThemeKey
                                    ]
                                  : successButtonTheme
                            },
                            PrivacyPolicy: () => <div>privacy policy</div>
                          }}
                        />
                      </Portal>
                    </BlockNumberProvider>
                  </ConfigProvider>
                </Web3Provider>
              </ReduxProvider>
            </header>
          }
        />
      </Routes>
    </HashRouter>
  );
};

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Wallet",
  component: Component,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: { onUserDisconnect: fn() },
  argTypes: {
    textColor: { control: "color" },
    chainSelectorBackgroundColor: { control: "color" },
    connectWalletSuccessButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    connectWalletErrorButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    accountDrawerBackgroundColor: { control: "color" },
    accountDrawerBuyCryptoThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    accountDrawerDisconnectBackgroundColor: { control: "color" },
    accountDrawerDisconnectColor: { control: "color" },
    walletBackgroundColor: { control: "color" },
    walletColor: { control: "color" },
    walletHoverFocusBackgroundColor: { control: "color" },
    walletHoverColor: { control: "color" },
    magicLoginButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    connectionErrorTryAgainButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    },
    connectionErrorBackToWalletSelectionButtonThemeKey: {
      control: "select",
      options: bosonButtonThemeKeys
    }
  },
  decorators: [
    (Story) => {
      return <Story />;
    }
  ]
} satisfies Meta<typeof Component>;

const BASE_ARGS = {
  PrivacyPolicy: () => <div>privacy policy</div>
} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const BosonTheme = {
  args: {
    ...BASE_ARGS,
    textColor: colors.black,
    chainSelectorBackgroundColor: "var(--buttonBgColor)",
    connectWalletBorderRadius: undefined,
    connectWalletSuccessButtonThemeKey: undefined,
    connectWalletErrorButtonThemeKey: "orangeInverse",
    accountDrawerBuyCryptoBorderRadiusPx: "0",
    accountDrawerBackgroundColor: "var(--primaryBgColor)",
    accountDrawerBuyCryptoThemeKey: undefined,
    accountDrawerDisconnectBackgroundColor: colors.green,
    accountDrawerDisconnectColor: colors.black,
    accountDrawerDisconnectBorderRadius: "12px",
    walletBorderRadius: "12px",
    walletIconBorderRadius: "0px",
    walletBackgroundColor: colors.secondary,
    walletColor: colors.white,
    walletHoverFocusBackgroundColor: colors.black,
    walletHoverColor: colors.white,
    magicLoginButtonThemeKey: undefined,
    connectionErrorTryAgainButtonThemeKey: "orangeInverse",
    connectionErrorBackToWalletSelectionButtonThemeKey: "orangeInverse"
  }
};

export const CustomTheme = {
  args: {
    ...BASE_ARGS,
    textColor: colors.white,
    chainSelectorBackgroundColor: "#00e1ff",
    connectWalletBorderRadius: "50",
    connectWalletSuccessButtonThemeKey: "accentFill",
    connectWalletErrorButtonThemeKey: "orangeInverse",
    accountDrawerBuyCryptoBorderRadiusPx: "50",
    accountDrawerBackgroundColor: "#123123",
    accountDrawerBuyCryptoThemeKey: "accentFill",
    accountDrawerDisconnectBorderRadius: "50px",
    accountDrawerDisconnectBackgroundColor: "#9b05ff",
    accountDrawerDisconnectColor: "#0dff00",
    walletBorderRadius: "10px",
    walletIconBorderRadius: "50px",
    walletBackgroundColor: "#ffd693",
    walletColor: "#ff00ea",
    walletHoverFocusBackgroundColor: "#e89f0e",
    walletHoverColor: "#ff0000",
    magicLoginButtonThemeKey: "orangeInverse",
    connectionErrorTryAgainButtonThemeKey: "orangeInverse",
    connectionErrorBackToWalletSelectionButtonThemeKey: "orangeInverse",
    magicLoginButtonBorderRadiusPx: "50",
    withMagicLogin: true,
    showStatusIcon: false,
    connectWalletChild: <>Connect</>,
    rightConnectedChild: <Wallet />
  }
};
