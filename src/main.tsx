import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "@/providers/AuthProvider";
import ThemeProvider from "@/components/theme-provider";
import { AlertProvider } from "@/providers/AlertProvider";
import { AppRoutes } from "./AppRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system">
        <AlertProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
