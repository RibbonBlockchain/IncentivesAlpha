import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import Alert from "../Alert";
import QR from "../QR";
import Login from "../Login";

import Home from "../Home";

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.currentProvider && appProps.currentProvider.selectedAddress ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

function UnAuthenticated({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !appProps.currentProvider ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/app" />
        )
      }
    />
  );
}

function Router() {
  const web3 = useSelector(state => state.web3);

  return (
    <>
      <Switch>
        <UnAuthenticated appProps={web3} path="/" component={Login} exact />
        <Route appProps={web3} path="/app" component={Home} />
      </Switch>
      <Alert />
      <QR />
    </>
  );
}

export default Router;
