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
  Grid
} from "../index";
import { HashRouter, Route, Routes } from "react-router-dom";

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
                  buyerSellerAgreementTemplate: "",
                  configId: "testing-80002-0",
                  contactSellerForExchangeUrl: "",
                  dateFormat: "",
                  defaultCurrencySymbol: "",
                  defaultCurrencyTicker: "",
                  envName: "testing",
                  fairExchangePolicyRules: "",
                  infuraKey: "abc",
                  licenseTemplate: "",
                  magicLinkKey: "def",
                  minimumDisputePeriodInDays: 1234,
                  minimumDisputeResolutionPeriodDays: 123444,
                  shortDateFormat: "",
                  walletConnectProjectId: "ghi",
                  withWeb3React: true,
                  commitProxyAddress: undefined,
                  enableCurationLists: true,
                  externalConnectedAccount: undefined,
                  externalConnectedChainId: undefined,
                  externalConnectedSigner: undefined,
                  metaTx: undefined,
                  offerCurationListBetweenCommas: undefined,
                  openseaLinkToOriginalMainnetCollection: undefined,
                  sellerCurationListBetweenCommas: undefined,
                  usePendingTransactions: undefined,
                  withExternalConnectionProps: undefined,
                  withOwnProducts: undefined,
                  withCustomReduxContext: false
                }}
              >
                <Grid>
                  <ChainSelector leftAlign={true} />
                  <ConnectWallet
                    connectedButtonTextColor="#f48ca1"
                    connectedToWrongChainButtonTextColor="#ff0000"
                  />
                </Grid>
                <Portal>
                  <AccountDrawer
                    buyCryptoColor="#ff7b00"
                    disconnectBackgroundColor="#9b05ff"
                    disconnectColor="#00f7ff31"
                    onUserDisconnect={() => {
                      console.log("on user disconnect");
                    }}
                    walletModalProps={{
                      optionProps: {
                        backgroundColor: "#ffee00",
                        headerTextColor: "#1eff00",
                        hoverFocusBackgroundColor: "#e89f0e",
                        hoverTextColor: "#ff0000"
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
export const PrimaryFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "primaryFill"
  }
};

export const PrimaryInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "primaryInverted"
  }
};

export const SecondaryFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "secondaryFill"
  }
};

export const SecondaryInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "secondaryInverted"
  }
};

export const AccentFill = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "accentFill"
  }
};

export const AccentInverted = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: false,
    variant: "accentInverted"
  }
};

export const Disabled = {
  args: {
    ...BASE_ARGS,
    disabled: true,
    loading: false,
    variant: "primaryFill"
  }
};

export const Loading = {
  args: {
    ...BASE_ARGS,
    disabled: false,
    loading: true,
    variant: "primaryFill"
  }
};
