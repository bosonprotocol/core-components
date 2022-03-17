import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reportWebVitals from "./reportWebVitals";
import { CreateOffer } from "./views/create-offer";
import { Home } from "./views/home";
import { ManageOffer } from "./views/manage-offer";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/create"
          element={
            <React.Suspense fallback={<></>}>
              <CreateOffer />
            </React.Suspense>
          }
        />
        <Route
          path="/manage"
          element={
            <React.Suspense fallback={<></>}>
              <ManageOffer />
            </React.Suspense>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
