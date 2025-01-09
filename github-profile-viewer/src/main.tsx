import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "./components/ui/provider";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // O arquivo de configuração do i18n

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider> {/* Usando o Provider customizado */}
        <App />
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
