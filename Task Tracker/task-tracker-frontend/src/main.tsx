import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { LoadingProvider } from "../src/Hooks/LoadingContext";
import { AuthProvider } from "./Hooks/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </React.StrictMode>
);
