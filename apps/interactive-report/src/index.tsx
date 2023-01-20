import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "App";
import reportWebVitals from "reportWebVitals";
import { AuthProvider } from "lib/AuthProvider";
import { PatientProvider } from "lib/PatientProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PatientProvider>
        <App />
      </PatientProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
