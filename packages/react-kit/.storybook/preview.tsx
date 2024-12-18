import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import GlobalStyle from "../src/components/styles/GlobalStyle";
import { ThemeProvider } from "styled-components";

import { colors } from "../src/theme";

const WithTheme = withThemeFromJSXProvider({
  Provider: ThemeProvider,
  GlobalStyles: GlobalStyle,
  themes: {
    theme: colors // TODO: is this correct?
  },
  defaultTheme: "theme"
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
