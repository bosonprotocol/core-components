import { fn } from "@storybook/test";
import {
  ConnectRoblox,
  ConnectRobloxProps
} from "../../components/widgets/roblox/ConnectRoblox";
import React from "react";
import { Meta } from "@storybook/react";
import { bosonButtonThemes } from "../../components/ui/ThemedButton";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    #storybook-root {
        width: 100%;
    }
`;
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Roblox/ConnectRoblox",
  component: ConnectRoblox,
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
} satisfies Meta<typeof ConnectRoblox>;

const BASE_ARGS = {} as const;

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Base = {
  args: {
    ...BASE_ARGS,
    config: {
      configId: "testing-80002-0",
      envName: "testing",
      infuraKey: process.env.REACT_APP_INFURA_KEY ?? "",
      magicLinkKey: process.env.STORYBOOK_REACT_APP_MAGIC_API_KEY ?? "",
      walletConnectProjectId:
        process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ?? ""
    },
    brand: "GYMSHARK",
    theme: {
      robloxCard: {
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
            borderRadius: 8
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      },
      walletCard: {
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
            borderRadius: 8
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      },
      signUpCard: {
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
            borderRadius: 8
          },
          inactive: bosonButtonThemes({ withBosonStyle: true })["white"]
        }
      }
    }
  } satisfies ConnectRobloxProps
};
