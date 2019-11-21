import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./modules/App";
import * as serviceWorker from "./serviceWorker";
import "react-virtualized/styles.css";
import "react-datepicker/dist/react-datepicker.css";

import ErrorBoundary from "./common/components/ErrorBoundary";
import StorageProvider, {
  Updater as StorageUpdater
} from "./common/providers/Storage.provider";

import Web3Provider from "./common/providers/Web3.provider";
import ModalProvider from "./common/providers/Modal.provider";
import APIProvider from "./common/providers/API.provider";
import AppProvider from "./common/providers/App.provider";
import RatesProvider from "./common/providers/Rates.provider";
import TransactionStatusProvider from "./common/providers/TransactionStatus.provider";

const Updaters = () => (
  <>
    <StorageUpdater />
  </>
);

const ContextProviders = ({ children }) => (
  <>
    <RatesProvider>
      <StorageProvider>
        <AppProvider>
          <Web3Provider>
            <ModalProvider>
              <APIProvider>
                <TransactionStatusProvider>
                  {children}
                </TransactionStatusProvider>
              </APIProvider>
            </ModalProvider>
          </Web3Provider>
        </AppProvider>
      </StorageProvider>
    </RatesProvider>
  </>
);

ReactDOM.render(
  <ErrorBoundary>
    <ContextProviders>
      <Updaters />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ContextProviders>
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
