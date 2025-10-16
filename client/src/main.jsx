import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Ant Design reset first to normalize styles
import "antd/dist/reset.css";
import "./index.css";
import { ConfigProvider, theme as antdTheme } from "antd";
import App from "./App.jsx";
import { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
// Import the duplicate toggle fix script
import "./utils/fixDuplicateToggles.js";

// Wrap App with theme-aware ConfigProvider
function ThemedApp() {
  const { theme } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        token: {
          // Corporate brand tokens
          colorPrimary: "#e65100", // deep orange
          colorInfo: "#1565c0",
          borderRadius: 8,
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
        },
        algorithm: theme === 'dark' 
          ? antdTheme.darkAlgorithm 
          : antdTheme.defaultAlgorithm,
        components: {
          Layout: {
            headerBg: "var(--header-bg)",
            headerColor: "var(--header-color)",
            bodyBg: "var(--body-bg)",
            footerBg: "var(--footer-bg)",
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </StrictMode>
);
