import {
  ConnectRoblox,
  ConnectRobloxProps
} from "../../components/widgets/roblox/components/ConnectRoblox";
import React from "react";
import { Meta } from "@storybook/react";
import { bosonButtonThemes } from "../../components/ui/ThemedButton";
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
      sendDeliveryInfoThroughXMTP
      backendOrigin="http://localhost:3336"
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
} satisfies Meta<typeof ConnectRobloxWrapper>;

const BASE_ARGS = {} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: {
    ...BASE_ARGS,
    brand: "GYMSHARK",
    sellerId: "4",
    theme: {
      backgroundColor: "white",
      lineBetweenStepsColor: "grey",
      stepsBackgroundSides: "white",
      walletPanel: {
        backgroundColor: "white",
        buyCryptoTheme: bosonButtonThemes({ withBosonStyle: true })[
          "bosonPrimary"
        ],
        connectionErrorProps: {
          backToWalletSelectionTheme: bosonButtonThemes({
            withBosonStyle: true
          })["bosonPrimary"],
          tryAgainTheme: bosonButtonThemes({ withBosonStyle: true })["orange"]
        },
        disconnectBackgroundColor: "grey",
        disconnectBorderRadius: "8px",
        disconnectColor: "grey",
        optionProps: {
          backgroundColor: "violet",
          borderRadius: "8px",
          color: "white",
          hoverColor: "white",
          hoverFocusBackgroundColor: "black",
          iconBorderRadius: "8px"
        }
      },
      robloxCard: {
        padding: 0,
        title: {
          color: "black"
        },
        subtitle: {
          color: "#556072"
        },
        check: {
          color: "#02F3A2"
        },
        number: {
          active: {
            backgroundColor: "#02F3A2",
            stroke: "black"
          },
          inactive: {
            backgroundColor: "#F1F3F9",
            stroke: "black"
          }
        },
        button: {
          active: {
            ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
            borderRadius: "8px"
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      },
      walletCard: {
        padding: 0,
        title: {
          color: "black"
        },
        subtitle: {
          color: "#556072"
        },
        check: {
          color: "#02F3A2"
        },
        number: {
          active: {
            backgroundColor: "#02F3A2",
            stroke: "black"
          },
          inactive: {
            backgroundColor: "#F1F3F9",
            stroke: "black"
          }
        },
        button: {
          active: {
            ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
            borderRadius: "8px"
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      },
      signUpCard: {
        padding: 0,
        title: {
          color: "black"
        },
        subtitle: {
          color: "#556072"
        },
        check: {
          color: "#02F3A2"
        },
        number: {
          active: {
            backgroundColor: "#02F3A2",
            stroke: "black"
          },
          inactive: {
            backgroundColor: "#F1F3F9",
            stroke: "black"
          }
        },
        button: {
          active: {
            ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
            borderRadius: "8px"
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      }
    }
  } satisfies ConnectRobloxProps
};
