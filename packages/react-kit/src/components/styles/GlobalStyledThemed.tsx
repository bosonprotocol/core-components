import React from "react";
import GlobalStyle from "./GlobalStyle";
import { useBosonTheme } from "../widgets/BosonThemeProvider";

export const GlobalStyledThemed = () => {
  const { theme } = useBosonTheme();
  return <GlobalStyle theme={theme} />;
};
