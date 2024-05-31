import { fn } from "@storybook/test";
import React from "react";
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
  theme
} from "../index";
import { HashRouter, Route, Routes } from "react-router-dom";
import { bosonButtonThemeKeys } from "../components/ui/ThemedButton";
const colors = theme.colors.light;
const successButtonTheme: ConnectWalletProps["successButtonTheme"] = {
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
const configId = envConfig[0].configId;
const Component = ({
  chainSelectorBackgroundColor,
  connectWalletSuccessButtonThemeKey,
  connectWalletErrorButtonThemeKey,
  accountDrawerBackgroundColor,
  accountDrawerBuyCryptoColor,
  accountDrawerBuyCryptoBackgroundColor,
  accountDrawerDisconnectBackgroundColor,
  accountDrawerDisconnectColor,
  walletBackgroundColor,
  walletColor,
  walletHoverFocusBackgroundColor,
  walletHoverColor,
  magicLoginButtonThemeKey,
  onUserDisconnect
}: {
  chainSelectorBackgroundColor: string | undefined;
  connectWalletSuccessButtonThemeKey: string | undefined;
  connectWalletErrorButtonThemeKey: string | undefined;
  accountDrawerBackgroundColor: string | undefined;
  accountDrawerBuyCryptoColor: string | undefined;
  accountDrawerBuyCryptoBackgroundColor: string | undefined;
  accountDrawerDisconnectBackgroundColor: string | undefined;
  accountDrawerDisconnectColor: string | undefined;
  walletBackgroundColor: string | undefined;
  walletColor: string | undefined;
  walletHoverFocusBackgroundColor: string | undefined;
  walletHoverColor: string | undefined;
  magicLoginButtonThemeKey: string | undefined;
  onUserDisconnect: () => unknown;
}) => {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <header>
              <Web3Provider
                configProps={{
                  buyerSellerAgreementTemplate: "", // should not be necessary
                  configId,
                  contactSellerForExchangeUrl: "", // should not be necessary
                  dateFormat: "", // should not be necessary
                  defaultCurrencySymbol: "", // should not be necessary
                  defaultCurrencyTicker: "", // should not be necessary
                  envName,
                  fairExchangePolicyRules: "", // should not be necessary
                  infuraKey: process.env.STORYBOOK_REACT_APP_INFURA_KEY || "",
                  licenseTemplate: "", // should not be necessary
                  magicLinkKey:
                    process.env.STORYBOOK_REACT_APP_MAGIC_API_KEY || "",
                  minimumDisputePeriodInDays: 1234, // should not be necessary
                  minimumDisputeResolutionPeriodDays: 123444, // should not be necessary
                  shortDateFormat: "", // should not be necessary
                  walletConnectProjectId:
                    process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
                  withWeb3React: true,
                  commitProxyAddress: undefined, // should not be necessary
                  enableCurationLists: true, // should not be necessary
                  externalConnectedAccount: undefined,
                  externalConnectedChainId: undefined,
                  externalConnectedSigner: undefined,
                  metaTx: undefined, // should not be necessary
                  offerCurationListBetweenCommas: undefined, // should not be necessary
                  openseaLinkToOriginalMainnetCollection: undefined, // should not be necessary
                  sellerCurationListBetweenCommas: undefined, // should not be necessary
                  usePendingTransactions: undefined, // should not be necessary
                  withExternalConnectionProps: false,
                  withOwnProducts: undefined, // should not be necessary
                  withCustomReduxContext: false
                }}
              >
                <Grid>
                  <ChainSelector
                    leftAlign={true}
                    backgroundColor={chainSelectorBackgroundColor}
                  />
                  <ConnectWallet
                    successButtonTheme={
                      connectWalletSuccessButtonThemeKey
                        ? bosonButtonThemes({ withBosonStyle: false })[
                            connectWalletSuccessButtonThemeKey
                          ]
                        : successButtonTheme
                    }
                    errorButtonTheme={
                      connectWalletErrorButtonThemeKey
                        ? bosonButtonThemes({ withBosonStyle: false })[
                            connectWalletErrorButtonThemeKey
                          ]
                        : errorButtonTheme
                    }
                  />
                </Grid>
                <Portal>
                  <AccountDrawer
                    backgroundColor={accountDrawerBackgroundColor}
                    buyCryptoColor={accountDrawerBuyCryptoColor}
                    buyCryptoBackgroundColor={
                      accountDrawerBuyCryptoBackgroundColor
                    }
                    disconnectBackgroundColor={
                      accountDrawerDisconnectBackgroundColor
                    }
                    disconnectColor={accountDrawerDisconnectColor}
                    onUserDisconnect={onUserDisconnect}
                    walletModalProps={{
                      optionProps: {
                        backgroundColor: walletBackgroundColor,
                        color: walletColor,
                        hoverFocusBackgroundColor:
                          walletHoverFocusBackgroundColor,
                        hoverColor: walletHoverColor
                      },
                      magicLoginButtonProps: {
                        buttonProps: {
                          theme: magicLoginButtonThemeKey
                            ? bosonButtonThemes({ withBosonStyle: false })[
                                magicLoginButtonThemeKey
                              ]
                            : successButtonTheme
                        }
                      },
                      PrivacyPolicy: () => <div>privacy policy</div>
                    }}
                  />
                </Portal>
              </Web3Provider>
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
    accountDrawerBuyCryptoColor: { control: "color" },
    accountDrawerBuyCryptoBackgroundColor: { control: "color" },
    accountDrawerDisconnectBackgroundColor: { control: "color" },
    accountDrawerDisconnectColor: { control: "color" },
    walletBackgroundColor: { control: "color" },
    walletColor: { control: "color" },
    walletHoverFocusBackgroundColor: { control: "color" },
    walletHoverColor: { control: "color" },
    magicLoginButtonThemeKey: {
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
    chainSelectorBackgroundColor: "var(--buttonBgColor)",
    connectWalletSuccessButtonThemeKey: undefined,
    connectWalletErrorButtonThemeKey: "orangeInverse",
    accountDrawerBackgroundColor: "var(--primaryBgColor)",
    accountDrawerBuyCryptoColor: colors.black,
    accountDrawerBuyCryptoBackgroundColor: "var(--buttonBgColor)",
    accountDrawerDisconnectBackgroundColor: colors.green,
    accountDrawerDisconnectColor: colors.black,
    walletBackgroundColor: "var(--secondaryBgColor)",
    walletColor: colors.white,
    walletHoverFocusBackgroundColor: colors.black,
    walletHoverColor: colors.white,
    magicLoginButtonThemeKey: undefined
  }
};

export const CustomTheme = {
  args: {
    ...BASE_ARGS,
    chainSelectorBackgroundColor: "#00e1ff",
    connectWalletSuccessButtonThemeKey: "accentFill",
    connectWalletErrorButtonThemeKey: "orangeInverse",
    accountDrawerBackgroundColor: "#123123",
    accountDrawerBuyCryptoColor: "#ff7b00",
    accountDrawerBuyCryptoBackgroundColor: "#bf00ff",
    accountDrawerDisconnectBackgroundColor: "#9b05ff",
    accountDrawerDisconnectColor: "#0dff00",
    walletBackgroundColor: "#ffd693",
    walletColor: "#ff00ea",
    walletHoverFocusBackgroundColor: "#e89f0e",
    walletHoverColor: "#ff0000",
    magicLoginButtonThemeKey: "#0f9a5b"
  }
};
