import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("Clerk Publishable Key from .env:", clerkFrontendApi); // Debugging



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <App />
    </ClerkProvider>
  </StrictMode>
);
