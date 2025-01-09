import React from "react";
import GlobalStyle from "./GlobalStyle";
import { useBosonTheme } from "../widgets/BosonThemeProvider";

export const GlobalStyledThemed = () => {
  const { theme } = useBosonTheme();
  console.log("GlobalStyledThemed theme", theme);
  return <GlobalStyle theme={theme} />;
};
