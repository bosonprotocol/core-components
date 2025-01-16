import {
  ConnectRoblox,
  ConnectRobloxProps
} from "../../components/widgets/roblox/components/ConnectRoblox";
import React from "react";
import { Meta } from "@storybook/react";
import { createGlobalStyle } from "styled-components";
import { EnvironmentType, getEnvConfigs } from "@bosonprotocol/core-sdk";
import { CommitWidgetProviders } from "../../components/widgets/commit/CommitWidgetProviders";
const envName =
  (process.env.STORYBOOK_DATA_ENV_NAME as EnvironmentType) || "testing";
const envConfig = getEnvConfigs(envName);
const configId = envConfig[0].configId;
const GlobalStyle = createGlobalStyle`
    #storybook-root, [scale="1"] {
        width: 100%;
    }
`;

const ConnectRobloxWrapper = (props: ConnectRobloxProps) => {
  return (
    <CommitWidgetProviders
      configId={configId}
      envName={envName}
      ipfsGateway={process.env.STORYBOOK_DATA_IPFS_GATEWAY}
      ipfsProjectId={process.env.STORYBOOK_DATA_IPFS_PROJECT_ID}
      ipfsProjectSecret={process.env.STORYBOOK_DATA_IPFS_PROJECT_SECRET}
      walletConnectProjectId={
        process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ?? ""
      }
      withCustomReduxContext={false}
      withReduxProvider={true}
      withWeb3React={true}
      withGlobalStyle={false}
      sendDeliveryInfoThroughXMTP
      roundness="min"
    >
      <ConnectRoblox {...props} />
    </CommitWidgetProviders>
  );
};
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Roblox/ConnectRoblox",
  component: ConnectRobloxWrapper,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered"
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {},
  argTypes: {},
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
} satisfies Meta<typeof ConnectRobloxWrapper>;

const BASE_ARGS = {} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: {
    ...BASE_ARGS,
    sellerId: "4",
    step3: {
      buttonText: "Step 3 button text",
      callback: () => {
        console.log("Step 3 button clicked");
      },
      title: "Step 3 title",
      subtitle: "Step 3 subtitle"
    }
  } satisfies ConnectRobloxProps
};
