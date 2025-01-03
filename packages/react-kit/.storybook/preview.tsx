import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import GlobalStyle from "../src/components/styles/GlobalStyle";

import { getThemes } from "../src/theme";
import { BosonThemeProvider } from "../src/components/widgets/BosonThemeProvider";

const themes = Object.keys(getThemes({ roundness: "min" })).reduce(
  (acum, current) => {
    acum[current] = current;
    return acum;
  },
  {}
) as any;
const WithTheme = withThemeFromJSXProvider({
  Provider: BosonThemeProvider,
  GlobalStyles: GlobalStyle,
  themes: themes,
  defaultTheme: "light"
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [WithTheme]
};

export default preview;
