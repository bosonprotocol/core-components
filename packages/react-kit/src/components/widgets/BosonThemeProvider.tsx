import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { ThemeProvider } from "styled-components";
import { Theme, themeKeys, getThemes, Roundness } from "../../theme";

type ThemeContextType<T extends Theme> = {
  theme: ReturnType<typeof getThemes>[T];
  setTheme: React.Dispatch<React.SetStateAction<T>>;
  themeKey: T;
  roundness: Roundness;
};

const BosonThemeContext = createContext<ThemeContextType<Theme> | null>(null);

export type BosonThemeProviderProps<T extends Theme = Theme> = {
  children: ReactNode;
  theme?: T;
  roundness: Roundness;
};
export const BosonThemeProvider = <T extends Theme>({
  children,
  theme: externallySelectedTheme,
  roundness
}: BosonThemeProviderProps<T>) => {
  const themesWithRoundness = useMemo(
    () => getThemes({ roundness }),
    [roundness]
  );
  const [theme, setTheme] = useState<T>(
    externallySelectedTheme &&
      themesWithRoundness[externallySelectedTheme] !== undefined
      ? externallySelectedTheme
      : (themeKeys.light as T)
  );
  useEffect(() => {
    if (
      externallySelectedTheme &&
      themesWithRoundness[externallySelectedTheme] !== undefined
    ) {
      setTheme(externallySelectedTheme);
    }
  }, [externallySelectedTheme, themesWithRoundness]);
  const selectedTheme = themesWithRoundness[theme];
  console.log("BosonThemeProvider", { roundness, selectedTheme });
  return (
    <ThemeProvider theme={selectedTheme}>
      <BosonThemeContext.Provider
        value={{
          theme: selectedTheme,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setTheme,
          themeKey: theme,
          roundness
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
