import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reportWebVitals from "./reportWebVitals";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

const CreateOffer = React.lazy(() => import("./views/create-offer"));
const ManageOffer = React.lazy(() => import("./views/manage-offer"));

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <React.Suspense fallback={<div>Loading...</div>}>
      <HashRouter>
        <Routes>
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
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
