import React from "react";
import ReactDOM from "react-dom/client";

import { AuthProvider } from "@loophealth/api";

import { App } from "App";
import reportWebVitals from "reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
