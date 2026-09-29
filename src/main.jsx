import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { BugProvider } from "./context/BugContext.jsx";
import { RoleProvider } from "./context/RoleContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RoleProvider>
      <BugProvider>
        <App />
      </BugProvider>
    </RoleProvider>
  </StrictMode>
);