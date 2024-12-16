import { fn } from "@storybook/test";
import {
  RobloxWidget,
  RobloxWidgetProps
} from "../../components/widgets/roblox/RobloxWidget";
import React from "react";
import { Meta } from "@storybook/react";
import { bosonButtonThemes } from "../../components/ui/ThemedButton";
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
        style: {
          background: "#F1F3F9",
          paddingTop: "5rem",
          paddingBottom: "5rem"
        },
        purchasedProducts: {
          title: {
            style: {
              margin: 0,
              marginBottom: "32px",
              color: "#09182C"
            }
          }
        },
        availableProducts: {
          title: {
            style: {
              margin: 0,
              color: "#09182C"
            }
          },
          subtitle: {
            style: {
              marginBottom: "32px",
              color: "#556072"
            }
          }
        },
        unavailabeProducts: {
          title: {
            style: {
              margin: 0,
              color: "#09182C"
            }
          },
          subtitle: {
            style: {
              marginBottom: "32px",
              color: "#556072"
            }
          }
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
      brand: "GYMSHARK",
      theme: {
        gapInPx: 24,
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
    }
  } satisfies RobloxWidgetProps
};
