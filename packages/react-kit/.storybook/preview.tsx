import type { Preview } from "@storybook/react";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import GlobalStyle from "../src/components/styles/GlobalStyle";
import { ThemeProvider } from "styled-components";

import { themes } from "../src/theme";
import { BosonThemeProvider } from "../src/components/widgets/BosonThemeProvider";

const WithTheme = withThemeFromJSXProvider({
  Provider: BosonThemeProvider,
  GlobalStyles: GlobalStyle,
  themes: {
    light: "light",
    blackAndWhite: "blackAndWhite",
    dark: "dark"
  } as any,
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
