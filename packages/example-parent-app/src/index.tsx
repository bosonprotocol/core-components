import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reportWebVitals from "./reportWebVitals";
import { Layout } from "./lib/components/Layout";
import { HomeView } from "./views/create";
import { Manage } from "./views/manage";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    color: white;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/manage" element={<Manage />} />
        <Route
          path="/background"
          element={
            <Layout>
              <div style={{ color: "red" }}>marius</div>
            </Layout>
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
