import { fn } from "@storybook/test";
import { Button } from "../components/buttons/Button";
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
  ConnectWalletProps
} from "../index";
import { HashRouter, Route, Routes } from "react-router-dom";

const successButtonTheme: ConnectWalletProps["successButtonTheme"] = {
  ...bosonButtonThemes({ withBosonStyle: false })["primary"],
  color: "inherit",
  background: "var(--buttonBgColor)"
};
const errorButtonTheme = bosonButtonThemes({ withBosonStyle: false })[
  "orangeInverse"
];

const Component = () => {
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
                  configId: "testing-80002-0",
                  contactSellerForExchangeUrl: "", // should not be necessary
                  dateFormat: "", // should not be necessary
                  defaultCurrencySymbol: "", // should not be necessary
                  defaultCurrencyTicker: "", // should not be necessary
                  envName: "testing",
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
                    backgroundColor="var(--buttonBgColor)"
                  />
                  <ConnectWallet
                    successButtonTheme={successButtonTheme}
                    errorButtonTheme={errorButtonTheme}
                  />
                </Grid>
                <Portal>
                  <AccountDrawer
                    backgroundColor="var(--primaryBgColor)"
                    buyCryptoColor="#ff7b00"
                    buyCryptoBackgroundColor="var(--buttonBgColor)"
                    disconnectBackgroundColor="#9b05ff"
                    disconnectColor="#0dff00"
                    onUserDisconnect={() => {
                      console.log("on user disconnect");
                    }}
                    walletModalProps={{
                      optionProps: {
                        backgroundColor: "var(--secondaryBgColor)",
                        color: "#ff00ea",
                        hoverFocusBackgroundColor: "#e89f0e",
                        hoverColor: "#ff0000"
                      },
                      magicLoginButtonProps: {
                        buttonProps: { theme: successButtonTheme }
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
  args: { onClick: fn() },
  argTypes: {
    disabled: { control: "boolean" },
    size: {
      control: "select",
      options: ["small", "regular", "large"]
    },
    children: { control: "text" },
    tooltip: { control: "text" }
  },
  decorators: [
    (Story) => {
      return <Story />;
    }
  ]
} satisfies Meta<typeof Button>;

const BASE_ARGS = {
  children: "Button Text",
  size: "regular",
  tooltip: "tooltip shown when disabled only"
} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const BosonTheme = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "primaryFill"
  }
};
