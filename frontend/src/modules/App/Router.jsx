import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { getItem } from "../../common/utils/storage";

import Alert from "../Alert";
import QRCodeDisplay from "../QRCodeDisplay";
import Login from "../Login";

import Home from "../Home";

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.address && appProps.token && appProps.loginType ? (
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
        !(appProps.address && appProps.token && appProps.loginType) ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/app" />
        )
      }
    />
  );
}

function Router() {
  let user = {
    address: getItem("address"),
    token: getItem("token"),
    loginType: getItem("loginType")
  };
  return (
    <>
      <Switch>
        <UnAuthenticated appProps={user} path="/" component={Login} exact />
        <AuthenticatedRoute appProps={user} path="/app" component={Home} />
      </Switch>
      <Alert />
      <QRCodeDisplay />
    </>
  );
}

export default Router;
