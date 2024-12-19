import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { ThemeProvider } from "styled-components";
import { Theme, themeKeys, themes } from "../../theme";

type ThemeContextType<T extends Theme> = {
  theme: (typeof themes)[T];
  setTheme: React.Dispatch<React.SetStateAction<T>>;
  themeKey: T;
};

const BosonThemeContext = createContext<ThemeContextType<Theme> | null>(null);

export type BosonThemeProviderProps<T extends Theme = Theme> = {
  children: ReactNode;
  theme?: T;
};
export const BosonThemeProvider = <T extends Theme>({
  children,
  theme: externallySelectedTheme
}: BosonThemeProviderProps<T>) => {
  const [theme, setTheme] = useState<T>(
    externallySelectedTheme && themes[externallySelectedTheme] !== undefined
      ? externallySelectedTheme
      : (themeKeys.light as T)
  );
  useEffect(() => {
    if (
      externallySelectedTheme &&
      themes[externallySelectedTheme] !== undefined
    ) {
      setTheme(externallySelectedTheme);
    }
  }, [externallySelectedTheme]);
  const selectedTheme = themes[theme];

  return (
    <ThemeProvider theme={selectedTheme}>
      <BosonThemeContext.Provider
        value={{
          theme: selectedTheme,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setTheme,
          themeKey: theme
        }}
      >
        {children}
      </BosonThemeContext.Provider>
    </ThemeProvider>
  );
};

type UseBosonThemeProps = {
  throwOnError?: boolean;
};
export const useBosonTheme = <T extends Theme>({
  throwOnError = true
}: UseBosonThemeProps = {}) => {
  const bosonTheme = useContext(
    BosonThemeContext
  ) as unknown as ThemeContextType<T>;
  if (!bosonTheme && throwOnError) {
    throw new Error("useBosonTheme must be used within a BosonThemeProvider");
  }
  return bosonTheme;
};
