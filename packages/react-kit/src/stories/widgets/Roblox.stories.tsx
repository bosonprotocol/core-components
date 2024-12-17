import { fn } from "@storybook/test";
import {
  RobloxWidget,
  RobloxWidgetProps
} from "../../components/widgets/roblox/RobloxWidget";
import React from "react";
import { Meta } from "@storybook/react";
import { bosonButtonThemes } from "../../components/ui/ThemedButton";
import { createGlobalStyle } from "styled-components";
import { theme } from "../../theme";
const colors = theme.colors.light;
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
          background: colors.lightGrey,
          paddingTop: "5rem",
          paddingBottom: "5rem"
        },
        commitButton: {
          color: "green",
          layout: "horizontal",
          shape: "rounded"
        },
        purchasedProducts: {
          title: {
            style: {
              margin: 0,
              marginBottom: "32px",
              color: colors.black
            }
          }
        },
        availableProducts: {
          title: {
            style: {
              margin: 0,
              color: colors.black
            }
          },
          subtitle: {
            style: {
              marginBottom: "32px",
              color: colors.darkGrey
            }
          }
        },
        unavailabeProducts: {
          title: {
            style: {
              margin: 0,
              color: colors.black
            }
          },
          subtitle: {
            style: {
              marginBottom: "32px",
              color: colors.darkGrey
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
        stepsBackgroundSides: "white",
        backgroundColor: "white",
        lineBetweenStepsColor: colors.lightGrey,
        robloxCard: {
          padding: "24px",
          title: {
            color: colors.black
          },
          subtitle: {
            color: colors.darkGrey
          },
          check: {
            color: colors.green
          },
          number: {
            active: {
              backgroundColor: colors.green,
              stroke: "black"
            },
            inactive: {
              backgroundColor: colors.lightGrey,
              stroke: "black"
            }
          },
          button: {
            active: {
              ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
              borderRadius: "8px"
            },
            inactive: {
              ...bosonButtonThemes({ withBosonStyle: true })["white"],
              borderRadius: "8px"
            }
          }
        },
        walletCard: {
          padding: "24px",
          title: {
            color: colors.black
          },
          subtitle: {
            color: colors.darkGrey
          },
          check: {
            color: colors.green
          },
          number: {
            active: {
              backgroundColor: colors.green,
              stroke: "black"
            },
            inactive: {
              backgroundColor: colors.lightGrey,
              stroke: "black"
            }
          },
          button: {
            active: {
              ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
              borderRadius: "8px"
            },
            inactive: {
              ...bosonButtonThemes({ withBosonStyle: true })["white"],
              borderRadius: "8px"
            }
          }
        },
        walletPanel: {
          backgroundColor: "white",
          buyCryptoTheme: bosonButtonThemes({ withBosonStyle: true })[
            "bosonPrimary"
          ],
          disconnectBorderRadius: "8px",
          disconnectBackgroundColor: colors.green,
          disconnectColor: "black",
          optionProps: {
            backgroundColor: colors.accent,
            borderRadius: "8px",
            color: colors.white,
            hoverColor: colors.white,
            hoverFocusBackgroundColor: colors.black,
            iconBorderRadius: "8px"
          },
          connectionErrorProps: {
            backToWalletSelectionTheme: bosonButtonThemes({
              withBosonStyle: true
            })["orangeInverse"],
            tryAgainTheme: bosonButtonThemes({ withBosonStyle: true })[
              "orangeInverse"
            ]
          }
        },
        signUpCard: {
          padding: "24px",
          title: {
            color: colors.black
          },
          subtitle: {
            color: colors.darkGrey
          },
          check: {
            color: colors.green
          },
          number: {
            active: {
              backgroundColor: colors.green,
              stroke: "black"
            },
            inactive: {
              backgroundColor: colors.lightGrey,
              stroke: "black"
            }
          },
          button: {
            active: {
              ...bosonButtonThemes({ withBosonStyle: true })["bosonPrimary"],
              borderRadius: "8px"
            },
            inactive: {
              ...bosonButtonThemes({ withBosonStyle: true })["white"],
              borderRadius: "8px"
            }
          }
        }
      }
    }
  } satisfies RobloxWidgetProps
};
