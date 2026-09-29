import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { BugProvider } from "./context/BugContext.jsx";
import { AuthProvider } from "./context/RoleContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BugProvider>
        <App />
      </BugProvider>
    </AuthProvider>
  </StrictMode>
);
