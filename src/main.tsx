import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "app";
import Providers from "app/Providers";
import reportWebVitals from "./reportWebVitals";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("New version found. Activating...");
                newWorker.postMessage({ type: "SKIP_WAITING" });
                window.location.reload();
              }
            });
          }
        });

        // Send version to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: "SET_VERSION",
            version: import.meta.env.VITE_VERSION,
          });
        }
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <Providers>
    <App />
  </Providers>,
);

reportWebVitals();
