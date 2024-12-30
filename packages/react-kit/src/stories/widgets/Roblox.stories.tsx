import {
  RobloxWidget,
  RobloxWidgetProps
} from "../../components/widgets/roblox/RobloxWidget";
import React from "react";
import { Meta } from "@storybook/react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    #storybook-root,[data-rk], [scale="1"] {
        width: 100%;
        padding: 0 !important;
    }
`;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Widgets/Roblox",
  component: RobloxWidget,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    // onClick: fn()
  },
  argTypes: {
    // disabled: { control: "boolean" },
    // size: {
    //   control: "select",
    //   options: ["small", "regular", "large"]
    // },
    // children: { control: "text" },
    // tooltip: { control: "text" }
  },
  decorators: [
    (Story) => {
      return (
        <>
          <GlobalStyle />
          <Story />
        </>
      );
    }
  ]
} satisfies Meta<typeof RobloxWidget>;

const BASE_ARGS = {} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: {
    ...BASE_ARGS,

    productsGridProps: {
      theme: {
        commitButton: {
          color: "green",
          layout: "horizontal",
          shape: "rounded"
        }
      }
    },
    configProps: {
      configId: "testing-80002-0",
      envName: "testing",
      sellerId: "6",
      walletConnectProjectId:
        process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ?? "",
      backendOrigin: "http://localhost:3336",
      ipfsGateway: process.env.STORYBOOK_DATA_IPFS_GATEWAY,
      ipfsProjectId: process.env.STORYBOOK_DATA_IPFS_PROJECT_ID,
      ipfsProjectSecret: process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET,
      sendDeliveryInfoThroughXMTP: true,
      raiseDisputeForExchangeUrl:
        "https://drcenter-staging.on.fleek.co/#/exchange/{id}/raise-dispute",
      showProductsPreLogin: true
    },
    connectProps: {
      brand: "GYMSHARK"
    }
  } satisfies RobloxWidgetProps
};
