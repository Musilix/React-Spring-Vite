import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { LoadingProvider } from "../src/Hooks/LoadingContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
