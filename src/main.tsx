import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { ClerkProvider } from '@clerk/clerk-react'
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = "pk_test_aGFybWxlc3Mtc3VuZmlzaC01MC5jbGVyay5hY2NvdW50cy5kZXYk"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
