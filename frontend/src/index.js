import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Router from "./modules/App";
import * as serviceWorker from "./serviceWorker";
import "react-virtualized/styles.css";

import Web3Provider from "./common/providers/Web3.provider";
import ModalProvider from "./common/providers/Modal.provider";
import APIProvider from "./common/providers/API.provider";

const ContextProviders = ({ children }) => (
  <>
    <Web3Provider>
      <ModalProvider>
        <APIProvider>{children}</APIProvider>
      </ModalProvider>
    </Web3Provider>
  </>
);

ReactDOM.render(
  <ContextProviders>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ContextProviders>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
