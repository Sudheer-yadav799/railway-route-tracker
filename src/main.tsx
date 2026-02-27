import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

import "leaflet/dist/leaflet.css";
import "leaflet-measure/dist/leaflet-measure.css";
import "./styles/railway-theme.css";
import { Provider } from "react-redux";
import { store } from "./store/store";

const queryClient = new QueryClient();

/* ----------------------------------------
   Render App
----------------------------------------- */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);