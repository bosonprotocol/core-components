import React from "react";
import { Meta } from "@storybook/react";

import { CommitButtonView } from "../../components/buttons/commit/CommitButtonView";
import { BosonThemeProvider } from "../../components/widgets/BosonThemeProvider";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { getThemes } from "../../theme";
import GlobalStyle from "../../components/styles/GlobalStyle";
import { CommitButtonViewProps } from "../../components/buttons/commit/types";

const themes = Object.keys({
  light: getThemes({ roundness: "min" })["light"]
}).reduce((acum, current) => {
  acum[current] = current;
  return acum;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}, {}) as any;
const WithLightThemeOnly = withThemeFromJSXProvider({
  Provider: BosonThemeProvider,
  GlobalStyles: GlobalStyle,
  themes: themes,
  defaultTheme: "light"
});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visual Components/Buttons/CommitButton",
  component: CommitButtonView,
  argTypes: {
    layout: {
      options: ["horizontal", "vertical"],
      control: { type: "radio" }
    },
    color: {
      options: ["green", "black", "white"],
      control: { type: "radio" }
    },
    shape: {
      options: ["sharp", "rounded", "pill"],
      control: { type: "radio" }
    }
  },
  decorators: [WithLightThemeOnly]
} as Meta<typeof CommitButtonView>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <CommitButtonView {...args} />;

export const Base = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {
  disabled: false,
  onClick: () => console.log("click"),
  minWidth: "200px",
  minHeight: undefined,
  layout: "horizontal",
  color: "green",
  shape: "sharp"
} satisfies CommitButtonViewProps;
