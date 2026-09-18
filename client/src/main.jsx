import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import { DoubtProvider } from "./context/DoubtContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DoubtProvider>
      <App />
    </DoubtProvider>
  </React.StrictMode>
);