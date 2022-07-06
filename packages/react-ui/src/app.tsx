import React from "react";
import theme from "./theme";
import GlobalStyles from "./global";
import { ThemeProvider } from "styled-components";

const MainPage = React.lazy(() => import("./views/main-page"));

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <MainPage />
      </ThemeProvider>
    </>
  );
};

export default App;
