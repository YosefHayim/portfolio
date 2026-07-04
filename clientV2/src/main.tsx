import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { SidebarProvider } from "./Components/ui/sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </BrowserRouter>
  </HelmetProvider>,
);
