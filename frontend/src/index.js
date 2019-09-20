import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import Web3Provider from "web3-react";
import Router from "./modules/App";
import connectors from './common/utils/web3/Connectors'
import store, { history } from "./common/redux";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName="ethers.js">
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router />
      </ConnectedRouter>
    </Provider>
  </Web3Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
