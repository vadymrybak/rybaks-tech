import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const isDevelopment = process.env.NODE_ENV === "development";

createRoot(document.getElementById("root")!).render(
  isDevelopment ? (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ) : (
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  ),
);
