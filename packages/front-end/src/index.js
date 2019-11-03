import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./modules/App";
import * as serviceWorker from "./serviceWorker";
import "react-virtualized/styles.css";

import ErrorBoundary from "./common/components/ErrorBoundary";
import ThemeProvider, { GlobalStyle } from "./common/theme";
import StorageProvider, {
  Updater as StorageUpdater
} from "./common/providers/Storage.provider";

import Web3Provider from "./common/providers/Web3.provider";
import ModalProvider from "./common/providers/Modal.provider";
import APIProvider from "./common/providers/API.provider";
import AppProvider from "./common/providers/App.provider";
import TransactionStatusProvider from "./common/providers/TransactionStatus.provider";

const Updaters = () => (
  <>
    <StorageUpdater />
  </>
);

const ContextProviders = ({ children }) => (
  <>
    <StorageProvider>
      <AppProvider>
        <Web3Provider>
          <ModalProvider>
            <APIProvider>
              <TransactionStatusProvider>{children}</TransactionStatusProvider>
            </APIProvider>
          </ModalProvider>
        </Web3Provider>
      </AppProvider>
    </StorageProvider>
  </>
);

ReactDOM.render(
  <ErrorBoundary>
    <ContextProviders>
      <Updaters />
      <ThemeProvider>
        <BrowserRouter>
          <GlobalStyle />
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </ContextProviders>
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
