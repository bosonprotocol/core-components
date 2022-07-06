import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <>
    <React.Suspense fallback={<></>}>
      <App />
    </React.Suspense>
  </>,
  document.getElementById("root")
);

reportWebVitals();
