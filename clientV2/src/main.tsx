import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { SidebarProvider } from "./Components/ui/sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
<<<<<<< HEAD
    <BrowserRouter basename="/v2">
=======
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </BrowserRouter>
  </HelmetProvider>,
);
